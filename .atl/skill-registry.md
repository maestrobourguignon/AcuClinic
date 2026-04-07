# Skill Registry - AcuClinic

This file tracks available skills for this project.

## SDD Skills (Spec-Driven Development)

| Skill | Trigger | Description |
|-------|---------|-------------|
| sdd-init | "sdd init", "iniciar sdd" | Initialize SDD context |
| sdd-explore | /sdd-explore <topic> | Explore and investigate ideas |
| sdd-propose | /sdd-new <change> | Create change proposal |
| sdd-spec | Run via sdd-continue | Write specifications |
| sdd-design | Run via sdd-continue | Technical design document |
| sdd-tasks | Run via sdd-continue | Implementation task checklist |
| sdd-apply | /sdd-apply [change] | Implement tasks |
| sdd-verify | /sdd-verify [change] | Validate implementation |
| sdd-archive | /sdd-archive [change] | Sync delta specs to main |

## Project Context

- **Stack**: Expo 55 + React Native 0.83 + React 19 + TypeScript + Zustand + React Navigation 7
- **Architecture**: Clean separation (screens, store, navigation, types, data)
- **State**: Zustand with AsyncStorage persistence
- **Navigation**: Bottom tabs (4 screens: Puntos, Fórmulas, Pacientes, Agenda)
- **Data**: 361 acupuncture points in src/data/pointsComplete.ts

## Active Change

- **Current**: Agregar modo claro/oscuro con Theme system
