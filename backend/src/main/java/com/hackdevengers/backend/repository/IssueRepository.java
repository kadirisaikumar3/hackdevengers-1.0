package com.hackdevengers.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hackdevengers.backend.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findAllByOrderByIdDesc();

    Optional<Issue> findByTitleIgnoreCaseAndLocationIgnoreCase(
            String title,
            String location
    );
}