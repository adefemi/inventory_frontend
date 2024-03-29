import { Button, Form, Input } from 'antd';
import { useContext, useState } from 'react';
import { store } from '../../store';
import { errorHandler, NotificationTypes, openNotificationWithIcon } from '../../utils/functions';
import Axios from "axios"
import { SHOP_URL } from '../../utils/myPaths';
import { useEffect } from 'react';

export default function ShopForm({
    onAddComplete,
    activeItem
}: { onAddComplete: () => void, activeItem: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const { state: { userToken } } = useContext(store)
    const [form] = Form.useForm()

    const onFinish = async (values: any) => {
        setIsLoading(true)
        let url = SHOP_URL
        if (activeItem) {
            url = SHOP_URL + `/${activeItem.id}`
        }
        const result = await Axios[activeItem ? "patch" : "post"](url, values, { headers: { Authorization: userToken } }).catch(
            e => openNotificationWithIcon(NotificationTypes.ERROR, errorHandler(e))
        )
        if (result) {
            openNotificationWithIcon(NotificationTypes.SUCCESS, `Shop ${activeItem ? 'Added' : 'Updated'}  Successfully`)
            form.resetFields()
            onAddComplete()
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (activeItem) {
            form.setFieldsValue({ ...activeItem })
        }
    }, [activeItem])

    return (
        <div>

            <Form
                layout="vertical"
                requiredMark
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    label="Shop Name"
                    name="name"
                    rules={[{ required: true, message: "Please input shop name" }]}
                >
                    <Input placeholder="Enter shop name" />
                </Form.Item>

                <Button block type="primary" htmlType="submit" loading={isLoading}>{activeItem ? "Update" : "Submit"}</Button>
            </Form>
        </div>
    )
}
