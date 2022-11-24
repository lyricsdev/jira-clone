import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { User, UserId } from "@domain/user";
import { Issue } from "@domain/issue";
import { useAppStore } from "@app/views/app";
import { useProjectStore } from "@app/views/app/project";
import { UserAvatar } from "@app/components/avatar";
import {
  SelectTrigger,
  SelectTriggerIcon,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
} from "@app/components/select";

export const SelectAsignee = ({ issue }: Props): JSX.Element => {
  const appStore = useAppStore();
  const projectStore = useProjectStore();
  const defaultValue = issue.asignee || appStore.user;
  const users = projectStore.project.users;

  const [selectedValue, setSelectedValue] = useState<User>(defaultValue);

  const onValueChange = (userId: UserId) => {
    const asignee = projectStore.project.getUser(userId);
    if (asignee) {
      setSelectedValue(asignee);
      issue.setAsignee(asignee);
    }
  };

  return (
    <Select.Root defaultValue={defaultValue.id} onValueChange={onValueChange}>
      <SelectTrigger>
        <div className="mr-2">
          <UserAvatar {...selectedValue} tooltip={false} size={32} />
        </div>
        <Select.Value />
        <SelectTriggerIcon />
      </SelectTrigger>
      <SelectContent>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {users.map((user, index) => (
            <SelectItem key={index} value={user.id}>
              <SelectItemIndicator />
              <UserAvatar {...user} tooltip={false} />
              <Select.ItemText>{user.name}</Select.ItemText>
            </SelectItem>
          ))}
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </SelectContent>
    </Select.Root>
  );
};

interface Props {
  issue: Issue;
}