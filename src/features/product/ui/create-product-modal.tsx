import {
	Button,
	Divider,
	Form,
	Input,
	InputNumber,
	Modal,
	Select,
	Switch,
	Typography,
	message,
} from 'antd'
import type {
	CreateProductRequest,
	Currency,
	ProductType,
} from '../../../entities/product/model/types'
import './create-product-modal.css'

const { Text } = Typography
const { TextArea } = Input

interface CreateProductFormValues {
	code: string
	name: string
	description?: string
	type: ProductType
	interestRate: number
	minAmount: number
	maxAmount: number
	currency: Currency
	active: boolean
	creditProduct?: {
		creditType: 'CONSUMER' | 'MORTGAGE' | 'AUTO'
		requiresCollateral: boolean
		repaymentSchedule: 'ANNUITY' | 'DIFFERENTIATED'
		termMonths: number
		earlyRepaymentFee?: number
	}
	depositProduct?: {
		replenishable: boolean
		earlyWithdrawalAllowed: boolean
		earlyWithdrawalPenalty?: number
		termDays: number
		minBalanceForInterest?: number
	}
}

interface CreateProductModalProps {
	open: boolean
	onClose: () => void
}

export function CreateProductModal({
	open,
	onClose,
}: CreateProductModalProps) {
	const [form] = Form.useForm<CreateProductFormValues>()
	const [messageApi, contextHolder] = message.useMessage()
	const selectedType = Form.useWatch('type', form)

	const handleOk = () => {
		form.submit()
	}

	const handleCancel = () => {
		form.resetFields()
		onClose()
	}

	const handleSubmit = (values: CreateProductFormValues) => {
		const payload: CreateProductRequest = {
			code: values.code,
			name: values.name,
			description: values.description,
			type: values.type,
			interestRate: values.interestRate,
			minAmount: values.minAmount,
			maxAmount: values.maxAmount,
			currency: values.currency,
			active: values.active,
			creditProduct:
				values.type === 'CREDIT' ? values.creditProduct : undefined,
			depositProduct:
				values.type === 'DEPOSIT' ? values.depositProduct : undefined,
		}

		console.info('Create product payload', payload)
		messageApi.success('Продукт создан (mock)')
		form.resetFields()
		onClose()
	}

	return (
		<>
			{contextHolder}
			<Modal
				title='Добавить продукт'
				open={open}
				onOk={handleOk}
				onCancel={handleCancel}
				okText='Создать'
				cancelText='Отмена'
				className='create-product-modal'
			>
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmit}
					initialValues={{
						type: 'CREDIT',
						currency: 'RUB',
						active: true,
						creditProduct: {
							requiresCollateral: false,
							repaymentSchedule: 'ANNUITY',
						},
						depositProduct: {
							replenishable: true,
							earlyWithdrawalAllowed: false,
						},
					}}
				>
					<Form.Item
						label='Код продукта'
						name='code'
						rules={[
							{ required: true, message: 'Введите код' },
						]}
					>
						<Input placeholder='CRD-001' />
					</Form.Item>
					<Form.Item
						label='Название'
						name='name'
						rules={[
							{ required: true, message: 'Введите название' },
						]}
					>
						<Input placeholder='Кредит наличными' />
					</Form.Item>
					<Form.Item label='Описание' name='description'>
						<TextArea rows={3} placeholder='Описание продукта' />
					</Form.Item>
					<Form.Item
						label='Тип продукта'
						name='type'
						rules={[
							{ required: true, message: 'Выберите тип' },
						]}
					>
						<Select
							options={[
								{ value: 'CREDIT', label: 'Кредит' },
								{ value: 'DEPOSIT', label: 'Депозит' },
								{ value: 'INVESTMENT', label: 'Инвестиции' },
							]}
						/>
					</Form.Item>

					<div className='create-product-modal__grid'>
						<Form.Item
							label='Процентная ставка'
							name='interestRate'
							rules={[
								{
									required: true,
									message: 'Введите ставку',
								},
							]}
						>
							<InputNumber min={0} addonAfter='%' />
						</Form.Item>
						<Form.Item
							label='Мин. сумма'
							name='minAmount'
							rules={[
								{
									required: true,
									message: 'Введите сумму',
								},
							]}
						>
							<InputNumber min={0} addonAfter='₽' />
						</Form.Item>
						<Form.Item
							label='Макс. сумма'
							name='maxAmount'
							rules={[
								{
									required: true,
									message: 'Введите сумму',
								},
							]}
						>
							<InputNumber min={0} addonAfter='₽' />
						</Form.Item>
						<Form.Item
							label='Валюта'
							name='currency'
							rules={[
								{
									required: true,
									message: 'Выберите валюту',
								},
							]}
						>
							<Select
								options={[
									{ value: 'RUB', label: 'RUB' },
									{ value: 'USD', label: 'USD' },
									{ value: 'EUR', label: 'EUR' },
								]}
							/>
						</Form.Item>
					</div>

					<Form.Item label='Статус' name='active' valuePropName='checked'>
						<Switch checkedChildren='Активен' unCheckedChildren='Неактивен' />
					</Form.Item>

					{selectedType === 'CREDIT' && (
						<>
							<Divider />
							<Text className='create-product-modal__section'>
								Параметры кредита
							</Text>
							<Form.Item
								label='Тип кредита'
								name={['creditProduct', 'creditType']}
								rules={[
									{
										required: true,
										message: 'Выберите тип кредита',
									},
								]}
							>
								<Select
									options={[
										{ value: 'CONSUMER', label: 'Потребительский' },
										{ value: 'MORTGAGE', label: 'Ипотека' },
										{ value: 'AUTO', label: 'Автокредит' },
									]}
								/>
							</Form.Item>
							<Form.Item
								label='График погашения'
								name={['creditProduct', 'repaymentSchedule']}
								rules={[
									{
										required: true,
										message: 'Выберите график',
									},
								]}
							>
								<Select
									options={[
										{ value: 'ANNUITY', label: 'Аннуитетный' },
										{
											value: 'DIFFERENTIATED',
											label: 'Дифференцированный',
										},
									]}
								/>
							</Form.Item>
							<div className='create-product-modal__grid'>
								<Form.Item
									label='Срок (мес.)'
									name={['creditProduct', 'termMonths']}
									rules={[
										{
											required: true,
											message: 'Укажите срок',
										},
									]}
								>
									<InputNumber min={1} max={600} />
								</Form.Item>
								<Form.Item
									label='Комиссия за досрочное погашение'
									name={['creditProduct', 'earlyRepaymentFee']}
								>
									<InputNumber min={0} addonAfter='%' />
								</Form.Item>
							</div>
							<Form.Item
								label='Требуется залог'
								name={['creditProduct', 'requiresCollateral']}
								valuePropName='checked'
							>
								<Switch />
							</Form.Item>
						</>
					)}

					{selectedType === 'DEPOSIT' && (
						<>
							<Divider />
							<Text className='create-product-modal__section'>
								Параметры депозита
							</Text>
							<div className='create-product-modal__grid'>
								<Form.Item
									label='Срок (дней)'
									name={['depositProduct', 'termDays']}
									rules={[
										{
											required: true,
											message: 'Укажите срок',
										},
									]}
								>
									<InputNumber min={1} max={3650} />
								</Form.Item>
								<Form.Item
									label='Минимальный баланс'
									name={['depositProduct', 'minBalanceForInterest']}
								>
									<InputNumber min={0} addonAfter='₽' />
								</Form.Item>
								<Form.Item
									label='Штраф за досрочное снятие'
									name={['depositProduct', 'earlyWithdrawalPenalty']}
								>
									<InputNumber min={0} addonAfter='%' />
								</Form.Item>
							</div>
							<Form.Item
								label='Пополняемый'
								name={['depositProduct', 'replenishable']}
								valuePropName='checked'
							>
								<Switch />
							</Form.Item>
							<Form.Item
								label='Досрочное снятие'
								name={['depositProduct', 'earlyWithdrawalAllowed']}
								valuePropName='checked'
							>
								<Switch />
							</Form.Item>
						</>
					)}
				</Form>
			</Modal>
		</>
	)
}
