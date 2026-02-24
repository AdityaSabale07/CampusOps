package com.campusops.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.LogsRepository;
import com.campusops.daos.CourseRouterRepository;
import com.campusops.entities.Course;
import com.campusops.entities.LogStatus;
import com.campusops.entities.Logs;
import com.campusops.entities.Module;
import com.campusops.entities.User;
import com.campusops.models.LogsDTO;

@Service
public class LogsService {

    @Autowired
    private LogsRepository logsRepo;

    @Autowired
    private CourseService courseService;

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseRouterRepository courseRouterRepo;

    // ================= STAFF =================

    // ✅ SAVE LOG
    public void saveLog(LogsDTO dto) {

        Logs log = new Logs();

        log.setCourse(courseService.findById(dto.getCourse_id()));
        log.setModule(moduleService.findById(dto.getModule_id()));
        log.setStaff(userService.findByUserId(dto.getStaff_id()));

        log.setGroup_name(dto.getGroup_name());
        log.setStudentProgress(dto.getStudentProgress());
        log.setAssignmentGiven(dto.getAssignmentGiven());
        log.setDate(dto.getDate());
        log.setStartTime(dto.getStartTime());
        log.setEndTime(dto.getEndTime());

        log.setStatus(LogStatus.PENDING);

        logsRepo.save(log);
    }

    // ✅ UPDATE LOG (Edit + Resubmit)
    public void updateLog(int logId, LogsDTO dto) {

        Logs log = findById(logId);

        if (log.getStatus() != LogStatus.REJECTED &&
            log.getStatus() != LogStatus.PENDING) {
            throw new RuntimeException("Only REJECTED or PENDING logs can be edited");
        }

        log.setCourse(courseService.findById(dto.getCourse_id()));
        log.setModule(moduleService.findById(dto.getModule_id()));

        log.setGroup_name(dto.getGroup_name());
        log.setStudentProgress(dto.getStudentProgress());
        log.setAssignmentGiven(dto.getAssignmentGiven());
        log.setDate(dto.getDate());
        log.setStartTime(dto.getStartTime());
        log.setEndTime(dto.getEndTime());

        // 🔥 Reset workflow fully
        log.setStatus(LogStatus.PENDING);
        log.setVerifiedBy(null);
        log.setVerifiedOn(null);
        log.setApprovedBy(null);
        log.setApprovedOn(null);
        log.setRouterRemark(null);
        log.setAdminRemark(null);

        logsRepo.save(log);
    }

    // ✅ DELETE LOG (Only Pending / Rejected)
    public void deleteLog(int id) {

        Logs log = findById(id);

        if (log.getStatus() == LogStatus.VERIFIED ||
            log.getStatus() == LogStatus.APPROVED) {
            throw new RuntimeException("Cannot delete VERIFIED or APPROVED logs");
        }

        logsRepo.delete(log);
    }

    // ================= COMMON LIST METHODS =================

    public List<Logs> listByStaffId(int staffId) {
        return logsRepo.findByStaff(userService.findByUserId(staffId));
    }

    public List<Logs> listAll() {
        return logsRepo.findAll();
    }

    public List<Logs> listByCourse(int courseId) {
        Course course = courseService.findById(courseId);
        return logsRepo.findByCourse(course);
    }

    public List<Logs> listByModule(int moduleId) {
        Module module = moduleService.findById(moduleId);
        return logsRepo.findByModule(module);
    }

    public Logs findById(int id) {
        return logsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
    }

    // ================= ROUTER (MODULE BASED) =================

    public List<Logs> getLogsForRouter(int routerId) {

        User router = userService.findByUserId(routerId);

        // 🔥 Get all modules where this user is router
        List<Module> routerModules = courseRouterRepo.findAll()
                .stream()
                .filter(cr -> cr.getRouter().getUserid() == routerId)
                .map(cr -> cr.getModule())
                .collect(Collectors.toList());

        if (routerModules.isEmpty()) {
            return List.of(); // return empty list instead of throwing error
        }

        // 🔥 Return pending logs for those modules
        return logsRepo.findAll()
                .stream()
                .filter(log ->
                        routerModules.contains(log.getModule()) &&
                        log.getStatus() == LogStatus.PENDING)
                .collect(Collectors.toList());
    }

    public void verifyLog(int logId, int routerId) {

        Logs log = findById(logId);
        User router = userService.findByUserId(routerId);

        if (log.getStatus() != LogStatus.PENDING)
            throw new RuntimeException("Only PENDING logs can be verified");

        if (!courseRouterRepo.existsByModuleAndRouter(log.getModule(), router))
            throw new RuntimeException("Not authorized router for this module");

        log.setStatus(LogStatus.VERIFIED);
        log.setVerifiedBy(router);
        log.setVerifiedOn(LocalDateTime.now());
        log.setRouterRemark(null);

        logsRepo.save(log);
    }

    public void rejectByRouter(int logId, int routerId, String remark) {

        Logs log = findById(logId);
        User router = userService.findByUserId(routerId);

        if (log.getStatus() != LogStatus.PENDING)
            throw new RuntimeException("Only PENDING logs can be rejected");

        if (!courseRouterRepo.existsByModuleAndRouter(log.getModule(), router))
            throw new RuntimeException("Not authorized router for this module");

        log.setStatus(LogStatus.REJECTED);
        log.setVerifiedBy(router);
        log.setVerifiedOn(LocalDateTime.now());
        log.setRouterRemark(remark);

        logsRepo.save(log);
    }

    // ================= ADMIN =================

    public List<Logs> getAllLogs() {
        return logsRepo.findAll();
    }

    public void approveLog(int logId, int adminId) {

        Logs log = findById(logId);

        if (log.getStatus() != LogStatus.VERIFIED)
            throw new RuntimeException("Only VERIFIED logs can be approved");

        User admin = userService.findByUserId(adminId);

        log.setStatus(LogStatus.APPROVED);
        log.setApprovedBy(admin);
        log.setApprovedOn(LocalDateTime.now());
        log.setAdminRemark(null);

        logsRepo.save(log);
    }

    public void rejectByAdmin(int logId, int adminId, String remark) {

        Logs log = findById(logId);

        if (log.getStatus() != LogStatus.VERIFIED)
            throw new RuntimeException("Only VERIFIED logs can be rejected");

        User admin = userService.findByUserId(adminId);

        log.setStatus(LogStatus.REJECTED);
        log.setApprovedBy(admin);
        log.setApprovedOn(LocalDateTime.now());
        log.setAdminRemark(remark);

        logsRepo.save(log);
    }
}
