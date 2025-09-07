import { Button, Form, Image, Input, Menu, Popconfirm, Popover, Upload, useMessage } from "musae";
import { first, useEvent, useMounted } from "@aiszlab/relax";
import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER } from "../../api/user";
import { useAuthentication } from "../../store/authentication";
import { Dir, upload } from "../../utils/upload";
import type { FileItem } from "musae/types/upload";

interface FormValues {
  nickname: string;
  username: string;
  emailAddress: string;
}

const Setting = () => {
  const { me } = useAuthentication();
  const form = Form.useForm<FormValues>();
  const [avatar, setAvatar] = useState<string | null>();
  const [_update] = useMutation(UPDATE_USER);
  const [messager] = useMessage();
  const _validAvatar = useMemo(() => avatar ?? me?.avatar ?? "", [avatar, me?.avatar]);
  const { whoAmI } = useAuthentication();

  useMounted(() => {
    if (!me) return;

    form.setFieldsValue({
      username: me.username,
      nickname: me.nickname,
      emailAddress: me.emailAddress,
    });
  });

  const removeAvatar = useEvent(async () => {
    setAvatar(null);
  });

  const submit = useEvent(async () => {
    const isValid = await form.validate().catch(() => false);
    if (!isValid) return;

    const { nickname } = form.getFieldsValue();
    const isSucceed = !!(
      await _update({
        variables: {
          updateUserBy: {
            nickname: nickname ?? "",
            avatar,
          },
        },
      }).catch(() => null)
    )?.data?.updateUser;

    if (!isSucceed) return;
    messager.success({
      description: "更新成功！",
    });

    // 重新请求用户信息
    whoAmI();
  });

  const onUpload = useEvent((files: FileItem[]) => {
    const _file = first(files);
    if (!_file?.url) return;
    setAvatar(_file.url);
  });

  const uploader = useEvent((file: File) => {
    return upload(file, Dir.Avatars);
  });

  const avatars = useMemo<FileItem[]>(
    () => [
      {
        url: _validAvatar,
        status: "success",
      },
    ],
    [_validAvatar],
  );

  return (
    <div className="flex gap-40">
      <Form className="flex-1" form={form}>
        <Form.Item
          label="昵称"
          name="nickname"
          supporting="昵称将会向所有用户直接展示。如果您非要展示用户名，可以在昵称中填写用户名~"
          required
        >
          <Input className="w-full" />
        </Form.Item>

        <Form.Item label="用户名" name="username" supporting="没有昵称时，用户名将直接展示">
          <Input disabled className="w-full" />
        </Form.Item>

        <Form.Item label="邮箱" name="emailAddress">
          <Input disabled className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button onClick={submit}>更新个人信息</Button>
        </Form.Item>
      </Form>
      <div className="relative w-50 h-fit">
        <Image
          width={200}
          height={200}
          src={_validAvatar}
          className="rounded-full"
          previewable={false}
          crossOrigin="anonymous"
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <Popover
          content={
            <Menu
              selectedKeys={[]}
              items={[
                {
                  key: "upload",
                  label: (
                    <Upload
                      value={avatars}
                      renderItem={false}
                      onChange={onUpload}
                      limit={1}
                      uploader={uploader}
                    >
                      上传头像
                    </Upload>
                  ),
                },
                {
                  key: "remove",
                  label: (
                    <Popconfirm
                      content="移除当前头像后，每次访问系统都将随机生成"
                      onConfirm={removeAvatar}
                      offset={12}
                      placement="bottom"
                    >
                      移除头像
                    </Popconfirm>
                  ),
                },
              ]}
            />
          }
          triggerBy="click"
        >
          <Button className="bottom-0 right-0 absolute">编辑头像</Button>
        </Popover>
      </div>
    </div>
  );
};

export default Setting;
