import { Authorization } from "@/api/authorization.types";
import { useBoolean } from "@aiszlab/relax";
import { Drawer } from "musae";
import { RefObject, useImperativeHandle } from "react";

export interface AuthorizationEditorRef {
  open: (authorization?: Authorization) => void;
}

interface Props {
  ref?: RefObject<AuthorizationEditorRef | null>;
}

/**
 * 权限点编辑器
 * 支持新增或编辑，取决于打开时是否传入权限点`id`
 */
const AuthorizationEditor = ({ ref }: Props) => {
  const {
    "0": isVisible,
    "1": { turnOn, turnOff },
  } = useBoolean();

  useImperativeHandle(ref, () => ({
    open: (authorization) => {
      turnOn();
    },
  }));

  return <Drawer open={isVisible}>权限点编辑器</Drawer>;
};

export default AuthorizationEditor;
