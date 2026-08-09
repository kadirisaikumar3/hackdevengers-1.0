package com.hackdevengers.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hackdevengers.backend.ai.AiAnalysisService;
import com.hackdevengers.backend.model.Issue;
import com.hackdevengers.backend.repository.IssueRepository;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final AiAnalysisService aiAnalysisService;

    public IssueService(
            IssueRepository issueRepository,
            AiAnalysisService aiAnalysisService) {

        this.issueRepository = issueRepository;
        this.aiAnalysisService = aiAnalysisService;
    }

    public Issue createIssue(Issue issue) {

        // Normalize title and location before checking duplicates
        String title = normalize(issue.getTitle());
        String location = normalize(issue.getLocation());

        issue.setTitle(title);
        issue.setLocation(location);

        // Duplicate check
        Optional<Issue> existingIssue =
                issueRepository.findByTitleIgnoreCaseAndLocationIgnoreCase(
                        title,
                        location
                );

        if (existingIssue.isPresent()) {
            throw new RuntimeException(
                    "Duplicate issue already exists with ID: "
                            + existingIssue.get().getId()
            );
        }

        // AI analysis
        Issue analyzedIssue = aiAnalysisService.analyze(issue);

        // Save new issue
        return issueRepository.save(analyzedIssue);
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAllByOrderByIdDesc();
    }

    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public Issue updateIssueStatus(Long id, String status) {

        Issue issue = issueRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Issue not found with id: " + id
                        )
                );

        issue.setStatus(status);

        return issueRepository.save(issue);
    }

    public long getIssueCount() {
        return issueRepository.count();
    }

    private String normalize(String value) {

        if (value == null) {
            return "";
        }

        return value
                .trim()
                .replaceAll("\\s+", " ");
    }
}