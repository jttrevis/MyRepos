import { useState, useCallback } from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus } from 'react-icons/fa';

import { api } from '../../services/api';

export const Main = () => {
	const [newRepo, setNewRepo] = useState('');
	const [repositories, setRepositories] = useState([]);
	function handleInputChange(e) {
		setNewRepo(e.target.value);
	}

	const hanldeSubmit = useCallback(
		(e) => {
			e.preventDefault();
			async function submit() {
				const response = await api.get(`repos/${newRepo}`);
				const data = {
					name: response.data.full_name,
				};

				setRepositories([...repositories, data]);
				setNewRepo('');
			}

			submit();
		},
		[newRepo, repositories],
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

				<SubmitButton>
					<FaPlus
						color='#fff'
						size={14}
					/>
				</SubmitButton>
			</Form>
		</Container>
	);
};
