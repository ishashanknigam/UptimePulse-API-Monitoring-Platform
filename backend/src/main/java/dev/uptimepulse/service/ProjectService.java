package dev.uptimepulse.service;

import dev.uptimepulse.dto.project.CreateProjectRequest;
import dev.uptimepulse.dto.project.ProjectResponse;
import dev.uptimepulse.entity.Project;
import dev.uptimepulse.entity.User;
import dev.uptimepulse.exception.ResourceNotFoundException;
import dev.uptimepulse.exception.UnauthorizedException;
import dev.uptimepulse.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectResponse create(CreateProjectRequest request, User user) {
        if (projectRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Project slug already taken: " + request.slug());
        }
        Project project = Project.builder()
                .name(request.name())
                .slug(request.slug())
                .description(request.description())
                .user(user)
                .build();
        return ProjectResponse.from(projectRepository.save(project));
    }

    public List<ProjectResponse> listByUser(Long userId) {
        return projectRepository.findByUserId(userId).stream()
                .map(ProjectResponse::from)
                .toList();
    }

    public ProjectResponse getById(Long projectId, Long userId) {
        return projectRepository.findByIdAndUserId(projectId, userId)
                .map(ProjectResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
    }

    public Project getEntityById(Long projectId, Long userId) {
        return projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
    }

    @Transactional
    public void delete(Long projectId, Long userId) {
        Project project = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));
        projectRepository.delete(project);
    }

    public Project getBySlug(String slug) {
        return projectRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + slug));
    }
}
