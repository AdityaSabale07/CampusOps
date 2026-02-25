package com.campusops.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campusops.daos.TaskRepository;
import com.campusops.daos.CourseRouterRepository;   // 🔥 Added
import com.campusops.entities.Task;
import com.campusops.entities.CourseRouter;         // 🔥 Added
import com.campusops.entities.Module;               // 🔥 Added
import com.campusops.entities.User;                 // 🔥 Added
import com.campusops.models.TaskDTO;

@Service
public class TaskService {

     @Autowired private TaskRepository tskrp;
     @Autowired private CourseService cservice;
     @Autowired private ModuleService mservice;
     @Autowired private UserService sservice;
     @Autowired private CourseRouterRepository courseRouterRepo;   // 🔥 Added


    // ================= SAVE TASK =================
    public void saveTask(TaskDTO dto) {

        Task task = new Task();

        Module module = mservice.findById(dto.getModule_id());
        User staff = sservice.findByUserId(dto.getStaff_id());

        task.setModule(module);
        task.setStaff(staff);
        task.setCourse(cservice.findById(dto.getCourse_id()));    
        task.setStartDate(dto.getStartDate());
        task.setEndDate(dto.getEndDate());

        tskrp.save(task);

        // 🔥 AUTO CONVERT STAFF TO ROUTER FOR THIS MODULE
        CourseRouter existingRouter = courseRouterRepo.findByModule(module);

        if (existingRouter == null) {
            CourseRouter newRouter = new CourseRouter();
            newRouter.setModule(module);
            newRouter.setRouter(staff);
            courseRouterRepo.save(newRouter);
        } else {
            existingRouter.setRouter(staff);  // replace router
            courseRouterRepo.save(existingRouter);
        }
    }

    // ================= OTHER METHODS (UNCHANGED) =================

    public List<Task> listall(){
        return tskrp.findAll();
    }

    public List<Task> listByCourse(int id){
        return tskrp.findByCourse(cservice.findById(id));
    }
    
    public List<Task> listByStaff(int id){
        return tskrp.findByStaff(sservice.findByUserId(id));
    }

    public List<Task> listByModule(int id){
        return tskrp.findByModule(mservice.findById(id));
    }
    
    public void deleteTask(int id) {
        tskrp.delete(tskrp.getById(id));
    }
    
    public Task findById(int id) {
        return tskrp.getById(id);
    }
}
