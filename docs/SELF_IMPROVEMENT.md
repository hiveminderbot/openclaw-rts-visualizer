# OpenClaw RTS Visualizer - Self Improvement Loop

## Overview
This project uses the self-improvement skill to continuously improve itself.

## How It Works

### 1. Error Capture
All errors are captured and classified:
- **Runtime errors** → Bug reports
- **Performance issues** → Optimization tasks  
- **API mismatches** → Compatibility updates

### 2. Automatic Issue Creation
When errors are detected:
1. Check if similar issue exists
2. Create new issue with context
3. Link to ontology task
4. Schedule fix if critical

### 3. Learning Loop
- Track feature usage
- Monitor performance metrics
- Adapt to OpenClaw API changes
- Improve based on user feedback

## Configuration

### Cron Jobs
```yaml
# Check for API changes daily
api_monitor:
  schedule: "0 9 * * *"
  task: Check OpenClaw Gateway API for changes

# Performance check every 6 hours
performance_check:
  schedule: "0 */6 * * *"
  task: Monitor visualizer performance metrics

# Weekly improvement review
improvement_review:
  schedule: "0 10 * * 1"
  task: Review self-improvement backlog
```

### Ontology Integration
All improvements tracked in ontology:
- Project: `proj_openclaw_rts_visualizer`
- Tasks: Auto-created for each issue
- Documents: Improvement proposals

## Manual Trigger
To force a self-improvement check:
```bash
openclaw skill self-improvement --project openclaw-rts-visualizer
```

## Contributing Improvements
See CONTRIBUTING.md for how to add new self-improvement capabilities.
