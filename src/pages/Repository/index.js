import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
	Container,
	Owner,
	Loading,
	BackButton,
	IssuesList,
	PageActions,
	ButtonState,
} from './styles';

export const Repository = ({ match }) => {
	const { repository } = useParams();

	const [repo, setRepo] = useState({});
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);

	const [filters, setFilters] = useState([
		{ state: 'all', label: 'All', active: true },
		{ state: 'open', label: 'Open', active: false },
		{ state: 'closed', label: 'Closed', active: false },
	]);

	const [filterIndex, setFilterIndex] = useState(0);
	useEffect(() => {
		async function load() {
			const [repoData, issuesData] = await Promise.all([
				api.get(`/repos/${repository}`),
				api.get(`/repos/${repository}/issues`, {
					params: {
						state: filters.find((f) => f.active).state,
						per_page: 15,
					},
				}),
			]);

			setRepo(repoData.data);
			setIssues(issuesData.data);

			setLoading(false);
		}

		load();
	}, [repository, filters]);

	function handleFilter(index) {
		setFilterIndex(index);
	}

	function handlePage(action) {
		setPage(action === 'prev' ? page - 1 : page + 1);
	}

	useEffect(() => {
		async function loadIssue() {
			const response = await api.get(`/repos/${repository}/issues`, {
				params: {
					state: filters[filterIndex].state,
					page,
					per_page: 15,
				},
			});
			setIssues(response.data);
		}
		loadIssue();
	}, [page, repository, filterIndex, filters]);

	if (loading) {
		return (
			<Loading>
				<h1>Loading...</h1>
			</Loading>
		);
	}
	return (
		<Container>
			<BackButton to='/'>
				<FaArrowLeft
					color='#000'
					size={35}
				/>
			</BackButton>
			<Owner>
				<img
					src={repo.owner.avatar_url}
					alt={repo.owner.name}
				/>
				<h1>{repo.name}</h1>
				<p>{repo.description} </p>
			</Owner>

			<ButtonState active={filterIndex}>
				{filters.map((filter, index) => (
					<button
						type='button'
						key={filter.label}
						onClick={() => handleFilter(index)}
					>
						{filter.label}
					</button>
				))}
			</ButtonState>

			<IssuesList>
				{issues.map((issue) => (
					<li key={String(issue.id)}>
						<img
							src={issue.user.avatar_url}
							alt={issue.user.login}
						/>

						<div>
							<strong>
								<a href={issue.html_url}>{issue.title}</a>

								{issue.labels.map((label) => (
									<span key={String(label.id)}>{label.name}</span>
								))}
							</strong>
							<p>{issue.user.login}</p>
						</div>
					</li>
				))}
			</IssuesList>

			<PageActions>
				<button
					type='button'
					onClick={() => handlePage('prev')}
					disabled={page < 2}
				>
					Prev
				</button>
				<button
					type='button'
					onClick={() => handlePage('next')}
				>
					Next
				</button>
			</PageActions>
		</Container>
	);
};
