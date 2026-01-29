import { Button, Checkbox, Input, Select, Typography, message } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './application-pipeline-page.css'

const { Title, Text } = Typography

type PipelineStatus = 'NEW' | 'PROCESSING' | 'DOCUMENTS' | 'APPROVED' | 'REJECTED'

interface PipelineCard {
	id: string
	title: string
	client: string
	amount: string
	createdAt: string
	product: string
}

const columnsOrder: PipelineStatus[] = [
	'NEW',
	'PROCESSING',
	'DOCUMENTS',
	'APPROVED',
	'REJECTED',
]

const columnLabels: Record<PipelineStatus, string> = {
	NEW: 'Новые',
	PROCESSING: 'В обработке',
	DOCUMENTS: 'Документы',
	APPROVED: 'Одобрено',
	REJECTED: 'Отклонено',
}

const initialColumns: Record<PipelineStatus, PipelineCard[]> = {
	NEW: [
		{
			id: 'app-1',
			title: 'Кредит наличными',
			client: 'Иван Петров',
			amount: '240 000 ₽',
			createdAt: 'Сегодня, 10:25',
			product: 'Кредит',
		},
		{
			id: 'app-2',
			title: 'Ипотека',
			client: 'Мария Смирнова',
			amount: '3 200 000 ₽',
			createdAt: 'Сегодня, 09:45',
			product: 'Ипотека',
		},
	],
	PROCESSING: [
		{
			id: 'app-3',
			title: 'Депозит «Надежный»',
			client: 'Алексей Волков',
			amount: '500 000 ₽',
			createdAt: 'Вчера, 18:10',
			product: 'Депозит',
		},
	],
	DOCUMENTS: [
		{
			id: 'app-4',
			title: 'Автокредит',
			client: 'Сергей Крылов',
			amount: '820 000 ₽',
			createdAt: 'Вчера, 14:00',
			product: 'Кредит',
		},
	],
	APPROVED: [
		{
			id: 'app-5',
			title: 'Кредит на ремонт',
			client: 'Дарья Миронова',
			amount: '300 000 ₽',
			createdAt: '10.01.2026',
			product: 'Кредит',
		},
	],
	REJECTED: [
		{
			id: 'app-6',
			title: 'Ипотека',
			client: 'Петр Власов',
			amount: '2 700 000 ₽',
			createdAt: '05.01.2026',
			product: 'Ипотека',
		},
	],
}

export function ApplicationPipelinePage() {
	const [messageApi, contextHolder] = message.useMessage()
	const [columns, setColumns] = useState(initialColumns)
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [draggedItem, setDraggedItem] = useState<{
		id: string
		from: PipelineStatus
	} | null>(null)

	const selectedCount = selectedIds.length
	const isBulkDisabled = selectedCount === 0

	const allIds = useMemo(
		() =>
			columnsOrder.flatMap((status) =>
				columns[status].map((item) => item.id),
			),
		[columns],
	)

	const handleSelectAll = () => {
		if (selectedIds.length === allIds.length) {
			setSelectedIds([])
			return
		}

		setSelectedIds(allIds)
	}

	const handleSelectCard = (event: CheckboxChangeEvent) => {
		const target = event.target as HTMLInputElement
		const id = target.dataset.id

		if (!id) {
			return
		}

		setSelectedIds((prev) =>
			event.target.checked ? [...prev, id] : prev.filter((item) => item !== id),
		)
	}

	const handleBulkAction = (action: string) => {
		messageApi.success(`Массовое действие: ${action} (${selectedCount})`)
	}

	const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		const id = event.currentTarget.dataset.id
		const from = event.currentTarget.dataset.status as PipelineStatus | undefined

		if (!id || !from) {
			return
		}

		event.dataTransfer.effectAllowed = 'move'
		setDraggedItem({ id, from })
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		const to = event.currentTarget.dataset.status as PipelineStatus | undefined

		if (!draggedItem || !to || draggedItem.from === to) {
			return
		}

		setColumns((prev) => {
			const item = prev[draggedItem.from].find(
				(card) => card.id === draggedItem.id,
			)

			if (!item) {
				return prev
			}

			return {
				...prev,
				[draggedItem.from]: prev[draggedItem.from].filter(
					(card) => card.id !== draggedItem.id,
				),
				[to]: [item, ...prev[to]],
			}
		})
		setDraggedItem(null)
	}

	return (
		<div className='application-pipeline'>
			{contextHolder}
			<div className='application-pipeline__header'>
				<div>
					<Title level={3}>Воронка заявок</Title>
					<Text type='secondary'>
						Управление потоком заявок и распределение
					</Text>
				</div>
				<div className='application-pipeline__bulk'>
					<Button onClick={handleSelectAll}>
						{selectedIds.length === allIds.length ? 'Снять выбор' : 'Выбрать все'}
					</Button>
					<Button
						disabled={isBulkDisabled}
						onClick={() => handleBulkAction('Назначить')}
					>
						Назначить
					</Button>
					<Button
						disabled={isBulkDisabled}
						onClick={() => handleBulkAction('Одобрить')}
					>
						Одобрить
					</Button>
					<Button
						disabled={isBulkDisabled}
						onClick={() => handleBulkAction('Отклонить')}
					>
						Отклонить
					</Button>
				</div>
			</div>

			<div className='application-pipeline__filters'>
				<Select
					placeholder='Статус'
					options={columnsOrder.map((status) => ({
						value: status,
						label: columnLabels[status],
					}))}
				/>
				<Select
					placeholder='Продукт'
					options={[
						{ value: 'credit', label: 'Кредит' },
						{ value: 'deposit', label: 'Депозит' },
						{ value: 'mortgage', label: 'Ипотека' },
					]}
				/>
				<Input placeholder='Поиск по заявкам' />
			</div>

			<div className='application-pipeline__board'>
				{columnsOrder.map((status) => (
					<div
						key={status}
						className='application-pipeline__column'
						data-status={status}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<div className='application-pipeline__column-header'>
							<Title level={5}>{columnLabels[status]}</Title>
							<Text type='secondary'>{columns[status].length}</Text>
						</div>
						<div className='application-pipeline__column-body'>
							{columns[status].map((card) => (
								<div
									key={card.id}
									className='application-pipeline__card'
									draggable
									data-id={card.id}
									data-status={status}
									onDragStart={handleDragStart}
								>
									<div className='application-pipeline__card-header'>
										<div className='application-pipeline__card-title'>
											{card.title}
										</div>
										<Checkbox
											checked={selectedIds.includes(card.id)}
											data-id={card.id}
											onChange={handleSelectCard}
										/>
									</div>
									<Text type='secondary'>
										{card.client} • {card.product}
									</Text>
									<div className='application-pipeline__card-footer'>
										<Text>{card.amount}</Text>
										<div className='application-pipeline__card-meta'>
											<Text type='secondary'>{card.createdAt}</Text>
											<Link
												to={`/app/applications/${card.id}`}
												className='application-pipeline__card-link'
											>
												Открыть
											</Link>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
