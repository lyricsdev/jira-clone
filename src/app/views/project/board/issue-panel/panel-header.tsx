import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import cx from "classix";
import { IssueId } from "@domain/issue";
import { Icon } from "@app/components/icon";

export const PanelHeader = ({
  id,
  onDeleteIssue,
  onClose,
}: PanelHeaderProps): JSX.Element => {
  return (
    <div className="flex">
      <span className="flex flex-grow items-center">
        <span className="flex items-center">
          <Icon name="task" size={16} />
        </span>
        <span className="ml-1 text-font-light text-opacity-80">{id}</span>
      </span>
      <DeleteIssueModalDialog action={onDeleteIssue} />
      <Dialog.Close
        onClick={onClose}
        className="ml-3 flex cursor-pointer rounded border-none p-1.5 text-icon hover:bg-grey-300"
      >
        <Icon name="close" size={24} />
      </Dialog.Close>
    </div>
  );
};

interface PanelHeaderProps {
  id: IssueId;
  onDeleteIssue: () => void;
  onClose: () => void;
}

const DeleteIssueModalDialog = ({
  action,
}: CloseModalDialogProps): JSX.Element => {
  const buttonBaseClass = cx(
    "border-none py-1.5 px-3.5 rounded bg-grey-300 font-primary-bold cursor-pointer"
  );

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="flex cursor-pointer rounded border-none p-1.5 text-icon hover:bg-grey-300 hover:text-error-main">
        <Icon name="delete" size={24} />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed top-0 left-0 z-50 h-full w-full bg-black bg-opacity-40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded bg-white p-5 shadow-lg">
          <AlertDialog.Title className="mb-5 font-primary-black text-3xl">
            Delete issue?
          </AlertDialog.Title>
          <AlertDialog.Description className="font-primary-light leading-6 text-font-light">
            This action is permanent and cannot be undone. Are you sure you want
            to remove this issue completely?
          </AlertDialog.Description>
          <div className="mt-8 flex w-full justify-end gap-4">
            <AlertDialog.Cancel
              className={cx("hover:bg-grey-400", buttonBaseClass)}
            >
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={action}
              className={cx(
                "bg-error-light text-error-dark hover:bg-error-hover",
                buttonBaseClass
              )}
            >
              Delete
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

interface CloseModalDialogProps {
  action: () => void;
}