document.addEventListener('DOMContentLoaded', async () => {
  const languageSelect = document.getElementById('Language')

  if (!languageSelect) {
    return
  }

  try {
    const response = await fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json')
    const languages = await response.json()

    const placeholder = document.createElement('option')
    placeholder.value = ''
    placeholder.textContent = 'Select a language'
    placeholder.selected = true
    placeholder.disabled = true
    languageSelect.appendChild(placeholder)

    languages.forEach((language) => {
      const option = document.createElement('option')
      option.value = language.value
      option.textContent = language.title
      languageSelect.appendChild(option)
    })
  } catch {
    return
  }
})

