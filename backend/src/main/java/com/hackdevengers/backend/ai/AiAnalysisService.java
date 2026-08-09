package com.hackdevengers.backend.ai;

import org.springframework.stereotype.Service;

import com.hackdevengers.backend.model.Issue;

@Service
public class AiAnalysisService {

    public Issue analyze(Issue issue) {

        String text = (
                (issue.getTitle() == null ? "" : issue.getTitle()) + " " +
                (issue.getDescription() == null ? "" : issue.getDescription())
        ).toLowerCase();

        // =========================================================
        // PRIORITY ANALYSIS
        // =========================================================

        if (containsAny(text,
                "accident",
                "fire",
                "flood",
                "danger",
                "emergency",
                "injury",
                "electric shock",
                "gas leak")) {

            issue.setPriority("HIGH");

        } else if (containsAny(text,
                "broken",
                "leak",
                "garbage",
                "pothole",
                "streetlight",
                "street light",
                "drain",
                "water")) {

            issue.setPriority("MEDIUM");

        } else {

            issue.setPriority("LOW");
        }

        // =========================================================
        // CATEGORY + DEPARTMENT + RECOMMENDED ACTION
        // =========================================================

        /*
         * IMPORTANT:
         * Electricity is checked BEFORE Roads.
         *
         * Otherwise "street light" contains the word "street",
         * which would incorrectly classify it as ROADS.
         */

        // 1. ELECTRICITY
        if (containsAny(text,
                "streetlight",
                "street light",
                "light",
                "lamp",
                "electric",
                "electricity",
                "power outage")) {

            issue.setCategory("ELECTRICITY");

            issue.setSuggestedDepartment(
                    "Electrical Department"
            );

            issue.setSuggestedAction(
                    "Inspect the electrical infrastructure and repair or replace the faulty equipment."
            );

        }

        // 2. ROADS
        else if (containsAny(text,
                "pothole",
                "road",
                "traffic",
                "highway",
                "footpath",
                "sidewalk")) {

            issue.setCategory("ROADS");

            issue.setSuggestedDepartment(
                    "Roads & Infrastructure Department"
            );

            issue.setSuggestedAction(
                    "Inspect the reported location and schedule repair or maintenance."
            );

        }

        // 3. SANITATION
        else if (containsAny(text,
                "garbage",
                "waste",
                "dump",
                "trash",
                "litter")) {

            issue.setCategory("SANITATION");

            issue.setSuggestedDepartment(
                    "Municipal Sanitation Department"
            );

            issue.setSuggestedAction(
                    "Arrange a sanitation inspection and waste collection."
            );

        }

        // 4. WATER
        else if (containsAny(text,
                "water",
                "pipe",
                "leak",
                "drain",
                "sewage",
                "sewer")) {

            issue.setCategory("WATER");

            issue.setSuggestedDepartment(
                    "Water Supply & Sewerage Department"
            );

            issue.setSuggestedAction(
                    "Inspect the water infrastructure and resolve the reported issue."
            );

        }

        // 5. PUBLIC SPACES
        else if (containsAny(text,
                "park",
                "tree",
                "green",
                "garden",
                "playground")) {

            issue.setCategory("PUBLIC_SPACES");

            issue.setSuggestedDepartment(
                    "Parks & Public Spaces Department"
            );

            issue.setSuggestedAction(
                    "Inspect the public space and schedule the required maintenance."
            );

        }

        // 6. GENERAL
        else {

            issue.setCategory("GENERAL");

            issue.setSuggestedDepartment(
                    "Municipal Administration"
            );

            issue.setSuggestedAction(
                    "Review the report and route it to the appropriate civic department."
            );
        }

        // =========================================================
        // AI SUMMARY
        // =========================================================

        String location = issue.getLocation() == null
                ? "the reported location"
                : issue.getLocation();

        issue.setAiSummary(
                "Civic issue reported at " + location +
                ". The system classified it as " +
                issue.getCategory() +
                " with " +
                issue.getPriority() +
                " priority and routed it to the " +
                issue.getSuggestedDepartment() +
                "."
        );

        return issue;
    }

    // =============================================================
    // KEYWORD HELPER
    // =============================================================

    private boolean containsAny(String text, String... keywords) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}