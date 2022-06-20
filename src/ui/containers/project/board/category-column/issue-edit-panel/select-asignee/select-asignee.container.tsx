import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import { usersMock } from "domain/user";
import { Avatar } from "ui/components/avatar";
import { Icon } from "ui/components/icon";
import styles from "./select-asignee.module.scss";

export const SelectAsignee = (): JSX.Element => {
  const defaultValue = usersMock[0].id;
  const [ selectValue, setSelectValue ] = useState<string>(defaultValue);

  const onValueChange = (value: string): void => {
    setSelectValue(value);
  }

  return (
    <Select.Root defaultValue={defaultValue} onValueChange={onValueChange}>
      <Select.Trigger className={`${styles.trigger} ${styles.trigger_asignee} ${styles[selectValue]}`}>
        <div className={styles.avatar}>
          <Avatar 
            size={32}
            image="default-avatar.png"
            tooltip="User"
          />
        </div>
        <Select.Value />
        <Select.Icon className={styles.icon}>
          <Icon name="arrow" size={28} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content className={styles.content}>
        <Select.ScrollUpButton />
        <Select.Viewport>
          {usersMock.map((user, index) => (
            <Select.Item
              key={index} 
              value={user.id} 
              className={`${styles.item} ${styles[user.id]}`}
            >
              <Avatar 
                size={32}
                image="default-avatar.png"
                tooltip="User"
              />
              <Select.ItemText>
                {user.name}
              </Select.ItemText>
              {/* <Select.ItemIndicator /> */}
            </Select.Item>
          ))}
          <Select.Separator />
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  )
}