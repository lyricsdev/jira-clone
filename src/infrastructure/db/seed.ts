import {
  PrismaClient,
  Project as ProjectDB,
  User as UserDB,
  Category as CategoryDB,
  Issue as IssueDB,
  Priority as PriorityDB,
} from "@prisma/client";
import { User, usersMock, getRandomPastelColor } from "@domain/user";
import { Project, ProjectId, projectsMock } from "@domain/project";
import { Category, CategoryId } from "@domain/category";
import { Issue } from "@domain/issue";
import { Priority, prioritiesMock } from "@domain/priority";

const db = new PrismaClient();

// Leaving the update empty will not update the record if it already exists


const createPriorityIfNotExists = async (priority: Priority): Promise<PriorityDB> => {
  return db.priority.upsert({
    where: { id: priority.id },
    create: {
      id: priority.id,
      name: priority.name,
      order: priority.order,
    },
    update: {},
  });
};

const createProjectIfNotExists = async (project: Project): Promise<ProjectDB> => {
  return db.project.upsert({
    where: { id: project.id },
    create: {
      id: project.id,
      name: project.name,
      description: project.description,
      image: project.image,
      users: {
        connect: project.users.map((user) => ({ id: user.id })),
      },
    },
    update: {},
  });
};

const createCategoryIfNotExists = async (
  category: Category,
  projectId: ProjectId
): Promise<CategoryDB> => {
  return db.category.upsert({
    where: { id: category.id },
    create: {
      id: category.id,
      type: category.type,
      name: category.name,
      order: category.order,
      project: { connect: { id: projectId } },
    },
    update: {},
  });
};

const createIssueIfNotExists = async (issue: Issue, categoryId: CategoryId): Promise<IssueDB> => {
  return db.issue.upsert({
    where: { id: issue.id },
    create: {
      id: issue.id,
      name: issue.name,
      description: issue.description,
      category: { connect: { id: categoryId } },
      asignee: { connect: { id: issue.asignee.id } },
      reporter: { connect: { id: issue.reporter.id } },
      priority: { connect: { id: issue.priority.id } },
      comments: {
        create: issue.comments.map((comment) => ({
          id: comment.id,
          message: comment.message,
          user: { connect: { id: comment.user.id } },
        })),
      },
    },
    update: {},
  });
};



const seedPriorities = async () => {
  for (const priority of prioritiesMock) {
    const priorityDb = await createPriorityIfNotExists(priority);
    recordAlreadyExists(priorityDb)
      ? console.info(`Priority already exists: ${priority.name}. Skipping...`)
      : console.info(`Created PRIORITY: ${priority.name}`);
  }
};


const seedDb = async () => {
  await seedPriorities();
};

type GenericRecord = {
  createdAt: Date;
  updatedAt: Date;
};
const recordAlreadyExists = (record: GenericRecord): boolean => {
  // If the time difference between createdAt and updatedAt is less than 100ms,
  // then we consider the record was just created. Otherwise, it was updated.
  const TIME_DIFFERENCE_THRESHOLD_MILISECONDS = 1000;
  const timeDifference = Date.now() - record.createdAt.getTime();
  return timeDifference > TIME_DIFFERENCE_THRESHOLD_MILISECONDS;
};

seedDb();
