import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useParams } from 'react-router-dom';
import { Container, Owner, Loading, BackButton } from './styles';
import { FaArrowLeft } from 'react-icons/fa';

export const Repository = ({ match }) => {
	const { repository } = useParams();

	const [repo, setRepo] = useState({});
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function load() {
			const [repoData, issuesData] = await Promise.all([
				api.get(`/repos/${repository}`),
				api.get(`/repos/${repository}/issues`),
				{
					params: {
						state: 'open',
					},
				},
			]);

			setRepo(repoData.data);
			setIssues(issuesData.data);
			console.log(repoData);
			setLoading(false);
		}

		load();
	}, [repository]);

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
					alt=''
				/>
				<h1>{repo.name}</h1>
				<p>{repo.description} </p>
			</Owner>
		</Container>
	);
};
