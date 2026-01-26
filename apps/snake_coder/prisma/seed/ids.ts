import { createId } from '@paralleldrive/cuid2'

export const SEED_IDS = {
  // Module Base
  id_moduleBase: createId(),

  // Sprints
  id_sprint1_moduleBase: createId(),
  id_sprint2_moduleBase: createId(),
  id_sprint3_moduleBase: createId(),

  // Missions Articles
  id_mission_article1_sprint1_moduleBase: createId(),
  id_mission_article2_sprint1_moduleBase: createId(),
  id_mission_article1_sprint2_moduleBase: createId(),
  id_mission_article1_sprint3_moduleBase: createId(),

  // Missions Quiz
  id_mission_quiz1_sprint1_moduleBase: createId(),
  id_mission_quiz2_sprint1_moduleBase: createId(),
  id_mission_quiz1_sprint2_moduleBase: createId(),
  id_mission_quiz1_sprint3_moduleBase: createId(),

  // Missions Task
  id_mission_task1_sprint2_moduleBase: createId(),
  id_mission_task1_sprint3_moduleBase: createId(),
  // ---------------------------------------------------------

  // Module Python Entry
  id_modulePythonEntry: createId(),

  // Sprints
  id_sprint1_modulePythonEntry: createId(),
  id_sprint2_modulePythonEntry: createId(),
  id_sprint3_modulePythonEntry: createId(),
  id_sprint4_modulePythonEntry: createId(),
  id_sprint5_modulePythonEntry: createId(),

  // Missions Articles
  id_mission_article1_sprint1_modulePythonEntry: createId(),
  id_mission_article1_sprint2_modulePythonEntry: createId(),
  id_mission_article1_sprint3_modulePythonEntry: createId(),
  id_mission_article1_sprint4_modulePythonEntry: createId(),
  id_mission_article1_sprint5_modulePythonEntry: createId(),

  // Missions Quiz
  id_mission_quiz1_sprint1_modulePythonEntry: createId(),
  id_mission_quiz1_sprint2_modulePythonEntry: createId(),
  id_mission_quiz1_sprint3_modulePythonEntry: createId(),
  id_mission_quiz1_sprint4_modulePythonEntry: createId(),
  id_mission_quiz1_sprint5_modulePythonEntry: createId(),

  // Missions Task
  // sprint 1
  id_mission_task1_sprint1_modulePythonEntry: createId(),
  id_mission_task2_sprint1_modulePythonEntry: createId(),
  id_mission_task3_sprint1_modulePythonEntry: createId(),
  id_mission_bugfix1_sprint1_modulePythonEntry: createId(),
  id_mission_bugfix2_sprint1_modulePythonEntry: createId(),
  // sprint 2
  id_mission_task1_sprint2_modulePythonEntry: createId(),
  id_mission_task2_sprint2_modulePythonEntry: createId(),
  id_mission_task3_sprint2_modulePythonEntry: createId(),
  id_mission_bugfix1_sprint2_modulePythonEntry: createId(),
  id_mission_bugfix2_sprint2_modulePythonEntry: createId(),
  // sprint 3
  id_mission_task1_sprint3_modulePythonEntry: createId(),
  id_mission_task2_sprint3_modulePythonEntry: createId(),
  id_mission_task3_sprint3_modulePythonEntry: createId(),
  id_mission_bugfix1_sprint3_modulePythonEntry: createId(),
  id_mission_bugfix2_sprint3_modulePythonEntry: createId(),
  // sprint 4
  id_mission_task1_sprint4_modulePythonEntry: createId(),
  id_mission_task2_sprint4_modulePythonEntry: createId(),
  id_mission_task3_sprint4_modulePythonEntry: createId(),
  id_mission_bugfix1_sprint4_modulePythonEntry: createId(),
  id_mission_bugfix2_sprint4_modulePythonEntry: createId(),
  // sprint 5
  id_mission_task1_sprint5_modulePythonEntry: createId(),
  id_mission_task2_sprint5_modulePythonEntry: createId(),
  id_mission_task3_sprint5_modulePythonEntry: createId(),
  id_mission_bugfix1_sprint5_modulePythonEntry: createId(),
  id_mission_bugfix2_sprint5_modulePythonEntry: createId(),
  // ---------------------------------------------------------

  // Module Python Advanced
  id_modulePythonAdvanced: createId(),
  // ---------------------------------------------------------

  // Module NumPy
  id_moduleNumPy: createId(),
  // ---------------------------------------------------------
} as const
