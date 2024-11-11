# Branching Workflow for HazardHunt

## Overview

This document outlines the branching strategy used in the HazardHunt project. This strategy is designed to facilitate a smooth development process, ensure quality through testing, and maintain stability in production.

## Branch Structure

The following branches are utilized in our workflow:

### 1. Main Branch (`main`)
- **Purpose**: This is the primary development branch where feature branches are created from.
- **Characteristics**:
  - The code in this branch should always be in a deployable state.
  - This branch serves as the base for all feature development.

### 2. Feature Branches
- **Purpose**: Developers create branches off of the main branch for specific features, bug fixes, or enhancements.
- **Naming Convention**: Feature branches should be named using the format `feature/{feature-name}` or just `{feature-name}`.
- **Example**: `feature/user-authentication` or `user-authentication`
- **Characteristics**:
  - Once work is completed, these branches are merged back into the main branch after a code review through a pull request (PR) and a successful CI-workflow completion.

### 3. User Acceptance Testing Branch (`uat`)
- **Purpose**: This branch is used to create a test version for user acceptance testing after merging changes into the main branch.
- **Characteristics**:
  - The latest development changes are merged into this branch and deployed to a UAT environment.
  - Feedback from testers can lead to further adjustments before merging to production.
  - A PR and a succesful CI-workflow completion are required before merging `main` to `uat` and before merging `uat` to `production`.

### 4. Production Branch (`production`)
- **Purpose**: This branch is for stable code that is deployed to the live environment.
- **Characteristics**:
  - Changes are merged into this branch from the UAT branch after successful testing and acceptance.
  - This ensures that only verified code reaches production.

## Workflow Summary

1. **Feature Development**:
   - Developers create a new feature branch from `main`.
   - Implement features, run tests, and commit changes.
   - Open a PR against the `main` branch for code review.

2. **Merging to Main**:
   - Once the feature is approved, it is merged into the `main` branch.

3. **Preparing for UAT**:
   - After merging into `main`, the latest changes are merged into the `uat` branch.
   - The UAT environment is deployed with the latest code for testing.

4. **User Acceptance Testing**:
   - Testers evaluate the application in the UAT environment.
   - Feedback is documented and used for further improvements.

5. **Merging to Production**:
   - Once testing is complete and changes are accepted, the UAT branch is merged into the `production` branch.
   - The `production` branch is deployed to the live environment.

## Best Practices

- **Regularly Sync UAT**: Ensure that the UAT branch is updated regularly with changes from the main branch to keep it relevant.
- **Automated Testing**: Implement CI/CD pipelines that run tests on the main and UAT branches.
- **Clear Documentation**: Maintain documentation for your workflow to ensure all team members are aligned.
