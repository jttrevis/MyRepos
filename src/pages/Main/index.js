import { useState, useCallback } from 'react';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';

import { api } from '../../services/api';

export const Main = () => {
	const [newRepo, setNewRepo] = useState('');
	const [repositories, setRepositories] = useState([]);
	const [loanding, setLoanding] = useState(false);
	function handleInputChange(e) {
		setNewRepo(e.target.value);
	}

	const hanldeSubmit = useCallback(
		(e) => {
			e.preventDefault();

			async function submit() {
				setLoanding(true);
				try {
					const response = await api.get(`repos/${newRepo}`);
					const data = {
						name: response.data.full_name,
					};

					setRepositories([...repositories, data]);
					setNewRepo('');
				} catch (err) {
					console.log(err);
				} finally {
					setLoanding(false);
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
				Main
			</h1>

			<Form onSubmit={hanldeSubmit}>
				<input
					type='text'
					placeholder='Add Repository'
					value={newRepo}
					onChange={handleInputChange}
				/>

				<SubmitButton loanding={loanding ? 1 : 0}>
					{loanding ? (
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
						<a href=''>
							<FaBars size={20} />
						</a>
					</li>
				))}
			</List>
		</Container>
	);
};
