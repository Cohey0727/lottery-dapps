import Button, { ButtonProps } from "@mui/material/Button";
import { Merge } from "utils";

type BaseProps = Omit<ButtonProps, "variant">;
type OwnProps = {};
export type ContainedButtonProps = Merge<BaseProps, OwnProps>;

const ContainedButton: React.FC<ContainedButtonProps> = (props) => {
  return <Button variant="contained" {...props} />;
};

export default ContainedButton;
