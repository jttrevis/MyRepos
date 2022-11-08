import { useState, useCallback, useEffect } from 'react';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';

import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export const Main = () => {
	const [newRepo, setNewRepo] = useState('');
	const [repositories, setRepositories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(null);

	useEffect(() => {
		saveLocalStorage();
	}, [repositories]);

	useEffect(() => {
		getLocalStorage();
	}, []);

	const saveLocalStorage = () => {
		if (repositories.length !== 0) {
			localStorage.setItem('repos', JSON.stringify(repositories));
		}
	};

	const getLocalStorage = () => {
		if (localStorage.getItem('repos') === null) {
			localStorage.setItem('repos', JSON.stringify([]));
		} else {
			let repoLocal = JSON.parse(localStorage.getItem('repos'));
			setRepositories(repoLocal);
		}
	};

	function handleInputChange(e) {
		setNewRepo(e.target.value);
		setAlert(null);
	}

	const hanldeSubmit = useCallback(
		(e) => {
			e.preventDefault();

			async function submit() {
				setLoading(true);
				setAlert(null);
				try {
					if (newRepo === '') {
						throw new Error('Digit the Repository name. Exp: facebook/react');
					}

					const response = await api.get(`repos/${newRepo}`);

					const hasRepo = repositories.find((repo) => repo.name === newRepo);
					if (hasRepo) {
						throw new Error('Repository added already!');
					}
					const data = {
						name: response.data.full_name,
					};

					setRepositories([...repositories, data]);
					setNewRepo('');
				} catch (err) {
					setAlert(true);
					console.log(err);
				} finally {
					setLoading(false);
				}
			}

			submit();
		},
		[newRepo, repositories],
	);

	const hanldeDelete = useCallback(
		(repo) => {
			const find = repositories.filter((r) => r.name !== repo);
			setRepositories(find);
		},
		[repositories],
	);

	return (
		<Container>
			<h1>
				<FaGithub size={25} />
				My Repositories
			</h1>

			<Form
				onSubmit={hanldeSubmit}
				error={alert}
			>
				<input
					type='text'
					placeholder='Add Repository'
					value={newRepo}
					onChange={handleInputChange}
				/>

				<SubmitButton loanding={loading ? 1 : 0}>
					{loading ? (
						<FaSpinner
							color='#fff'
							size={14}
						/>
					) : (
						<FaPlus
							color='#fff'
							size={14}
						/>
					)}
				</SubmitButton>
			</Form>

			<List>
				{repositories.map((repo) => (
					<li key={repo.name}>
						<span>
							<DeleteButton onClick={() => hanldeDelete(repo.name)}>
								<FaTrash size={14} />
							</DeleteButton>
							{repo.name}
						</span>
						<Link to={`/repository/${encodeURIComponent(repo.name)}`}>
							<FaBars size={20} />
						</Link>
					</li>
				))}
			</List>
		</Container>
	);
};
