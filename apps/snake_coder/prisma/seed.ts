import { createSeedClient } from './seed/client'
import { seedUsers } from './seed/users'
import { seedModules } from './seed/modules'
import { seedSprints } from './seed/sprints'
import { seedMissions } from './seed/missions'
import { seedTasks } from './seed/tasks'
import { seedQuizzes } from './seed/quizzes'
import { seedArticles } from './seed/articles'

const prisma = createSeedClient()

const main = async () => {
  await seedUsers(prisma)

  await seedModules(prisma)
  await seedSprints(prisma)
  await seedMissions(prisma)

  await seedTasks(prisma)

  await seedQuizzes(prisma)

  await seedArticles(prisma)
}

main()
  .catch((error) => {
    console.error('[seed] failed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
