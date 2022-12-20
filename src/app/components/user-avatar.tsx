import * as Avatar from "@radix-ui/react-avatar";
import { User } from "@domain/user";
import { Tooltip } from "@app/components/tooltip";

export const UserAvatar = ({
  name,
  image,
  color,
  size = 36,
  tooltip,
}: UserAvatarProps): JSX.Element => {
  const imageSize = {
    width: `${size}px`,
    height: `${size}px`,
  };
  const acronym = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Tooltip title={name} show={tooltip}>
      <Avatar.Root className="flex items-center rounded-full" style={imageSize}>
        <Avatar.Image
          className="rounded-full object-cover"
          src={image && `/avatars/${image}`}
          style={imageSize}
        />
        <Avatar.Fallback
          delayMs={0}
          className="flex items-center justify-center rounded-full text-font-main"
          style={{
            ...imageSize,
            backgroundColor: color,
          }}
        >
          {acronym}
        </Avatar.Fallback>
      </Avatar.Root>
    </Tooltip>
  );
};

interface UserAvatarProps extends User {
  size?: number;
  tooltip?: boolean;
}
