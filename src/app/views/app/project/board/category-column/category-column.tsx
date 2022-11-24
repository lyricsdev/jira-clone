import { observer } from "mobx-react-lite";
import cx from "classix";
import { useDrop } from "react-dnd";
import { Category, CategoryType } from "@domain/category";
import { Issue, IssueId } from "@domain/issue";
import { useAppStore } from "@app/views/app";
import { useProjectStore } from "@app/views/app/project";
import { Icon } from "@app/components/icon";
import { IssueCard, DRAG_ISSUE_CARD } from "./issue-card";
import { ScrollArea } from "@app/components/scroll-area";
import { priorities } from "@domain/priority";

export const CategoryColumn = observer(
  (props: CategoryColumnProps): JSX.Element => {
    const { category, isDragging, handleDragging } = props;
    const appStore = useAppStore();
    const projectStore = useProjectStore();
    const searchFilter = projectStore.filters.search.toLowerCase();
    const emptyCategory = category.issues.length === 0;

    const [{ isOver }, drop] = useDrop(
      () => ({
        accept: DRAG_ISSUE_CARD,
        drop: (item: DropItem) => changeIssueCategory(item),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }),
      [category.id]
    );

    interface DropItem {
      issueId: IssueId;
      categoryId: CategoryType;
    }

    const changeIssueCategory = ({ issueId, categoryId }: DropItem) => {
      const oldCategory = projectStore.project.getCategory(categoryId);

      if (!oldCategory || oldCategory.id === category.id) return;

      const issue = oldCategory.getIssue(issueId);

      if (!issue) return;

      issue.setCategoryId(category.type);
      oldCategory.removeIssue(issueId);
      category.addIssue(issue);
      // updateIssueDb(issue);
    };

    const createCategoryIssue = () => {
      const issue = new Issue({
        id: "1",
        categoryType: category.type,
        name: "",
        description: "",
        reporter: appStore.user,
        asignee: appStore.user,
        comments: [],
        priority: "low",
        createdAt: new Date().valueOf(),
      });
      projectStore.editingIssue = issue;
    };

    const filteredIssues = (): Issue[] =>
      category.issues
        .filter((issue) => {
          const name = issue.name.toLowerCase();
          return name.includes(searchFilter);
        })
        .sort((a, b) => {
          const sortA =
            projectStore.filters.sort === "date"
              ? a.createdAt
              : priorities.indexOf(a.priority);

          const sortB =
            projectStore.filters.sort === "date"
              ? b.createdAt
              : priorities.indexOf(b.priority);

          if (sortA < sortB) return 1;
          if (sortA > sortB) return -1;
          return 0;
        });

    return (
      <div
        ref={drop}
        className="relative flex h-full w-[260px] max-w-[260px] flex-col rounded-md bg-grey-200"
      >
        {/* Column drop area */}
        <div
          className={cx(
            "absolute z-50 box-border h-[100%] w-[100%] rounded p-1.5 duration-200",
            isDragging ? "visible" : "hidden",
            isOver || "bg-white bg-opacity-70"
          )}
        >
          <div
            className={cx(
              "relative h-full w-full rounded border-[3px]",
              isDragging ? "visible" : "hidden",
              isOver
                ? "border-solid border-success-main"
                : "flex items-center justify-center border-dashed border-primary-main"
            )}
          >
            {!isOver && <span className="rounded bg-white">DROP HERE</span>}
          </div>
        </div>
        {/* Column header */}
        <div className="sticky top-0 left-0 flex justify-between px-3 py-2.5 font-primary-light text-xs uppercase text-font-light duration-200 ease-in-out">
          <span className="flex gap-2">
            <span>{category.name}</span>
            {!emptyCategory && <span>( {category.issues.length} )</span>}
          </span>
          <button
            onClick={createCategoryIssue}
            className="flex cursor-pointer rounded border-none p-1 text-font-light/60 hover:bg-grey-400"
          >
            <Icon name="add" size={24} />
          </button>
        </div>
        {/* Column body items */}
        <div className="box-content h-[300px]">
          <ScrollArea>
            <ul className="mt-1 max-w-[260px] px-3">
              {emptyCategory ? (
                <EmptyCategory />
              ) : (
                filteredIssues().map((issue, index) => (
                  <li key={index} className="mb-2">
                    <IssueCard issue={issue} handleDragging={handleDragging} />
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </div>
      </div>
    );
  }
);

interface CategoryColumnProps {
  category: Category;
  isDragging: boolean;
  handleDragging: (isDragging: boolean) => void;
}

const EmptyCategory = (): JSX.Element => (
  <div className="mt-4 flex flex-col items-center text-font-light">
    <Icon name="empty" size={36} />
    <p className="mt-4 font-primary-light text-xs uppercase">No issues found</p>
  </div>
);