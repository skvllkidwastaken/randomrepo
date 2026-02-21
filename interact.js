document.addEventListener('DOMContentLoaded', () => {
	const languageSelect = document.getElementById('Language')
	const activateButton = document.querySelector('.activate')
	const outputBox = document.querySelector('.output')
	const idleBox = document.querySelector('.idle')
	const loadingBox = document.querySelector('.loading')
	const errorBox = document.querySelector('.error')
	const foundBox = document.querySelector('.found')

	if (!languageSelect || !activateButton || !foundBox || !outputBox) {
		return
	}

	const setState = (state) => {
		if (idleBox) idleBox.style.display = state === 'idle' ? 'block' : 'none'
		if (loadingBox) loadingBox.style.display = state === 'loading' ? 'block' : 'none'
		if (errorBox) errorBox.style.display = state === 'error' ? 'block' : 'none'
		foundBox.style.display = state === 'found' ? 'block' : 'none'
		outputBox.classList.toggle('error-state', state === 'error')
	}

	const getOctokitClient = () => {
		if (typeof window !== 'undefined' && typeof window.octokit !== 'undefined') {
			return window.octokit
		}

		if (typeof Octokit !== 'undefined') {
			return new Octokit()
		}

		return null
	}

	const findRandomRepository = async (language) => {
		const octokitClient = getOctokitClient()
		const randomPage = Math.floor(Math.random() * 10) + 1
		let repositories = []

		if (octokitClient) {
			const result = await octokitClient.request('GET /search/repositories', {
				q: `language:${language} stars:>10`,
				sort: 'updated',
				order: 'desc',
				per_page: 100,
				page: randomPage,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			})

			repositories = result.data.items || []
		} else {
			const response = await fetch(`https://api.github.com/search/repositories?q=language:${encodeURIComponent(language)}+stars:%3E10&sort=updated&order=desc&per_page=100&page=${randomPage}`, {
				headers: {
					'X-GitHub-Api-Version': '2022-11-28'
				}
			})

			if (!response.ok) {
				throw new Error('GitHub request failed')
			}

			const data = await response.json()
			repositories = data.items || []
		}

		if (!repositories.length) {
			throw new Error('No repositories found')
		}

		return repositories[Math.floor(Math.random() * repositories.length)]
	}

	setState('idle')

	activateButton.addEventListener('click', async () => {
		const selectedLanguage = languageSelect.value
		if (!selectedLanguage) {
			setState('idle')
			return
		}

		setState('loading')

		try {
			const randomRepository = await findRandomRepository(selectedLanguage)

			foundBox.innerHTML = `
				<h2>${randomRepository.full_name}</h2>
				<p>${randomRepository.description || 'No description provided.'}</p>
				<a href="${randomRepository.html_url}" target="_blank" rel="noopener noreferrer">Open on GitHub</a>
			`

			setState('found')
		} catch {
			setState('error')
		}
	})
})
