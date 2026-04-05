package dev.uptimepulse.repository;

import dev.uptimepulse.entity.Monitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface MonitorRepository extends JpaRepository<Monitor, Long> {
    List<Monitor> findByProjectId(Long projectId);
    Optional<Monitor> findByIdAndProjectId(Long id, Long projectId);

    // BUG-3 FIX: each monitor is due when lastCheckedAt is older than its own intervalSeconds
    @Query(value = "SELECT * FROM monitors m WHERE m.active = true AND " +
           "(m.last_checked_at IS NULL OR " +
           " m.last_checked_at < CAST(:now AS timestamp with time zone) - (m.interval_seconds * interval '1 second'))", 
           nativeQuery = true)
    List<Monitor> findDueMonitors(@org.springframework.data.repository.query.Param("now") Instant now);

    // LOG-8 FIX: direct update query instead of SELECT + UPDATE
    @Modifying
    @Transactional
    @Query("UPDATE Monitor m SET m.lastCheckedAt = :now WHERE m.id = :id")
    void updateLastCheckedAt(Long id, Instant now);

    List<Monitor> findByActiveTrue();

    long countByProjectId(Long projectId);
}
