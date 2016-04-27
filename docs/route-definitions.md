# Routes

`/` -> redirects to `/:username` or `/login` depending on session
`/login` -> provides for with username, password. redirects to `/:username`. also a link to `/signup`
`/signup` -> provides form with username, password, and opt. email. redirects to `/:username`
`/:username` -> shows links to `/:username/:projects` and `/:username/:blogposts`. also a dropdown or button to show api secret
`/:username/projects` -> shows a list of all the projects and an Add button
`/:username/projects/new` -> empty form for new project
`/:username/projects/:id` -> full details of project and edit button

`/:username/settings` -> displays user settings and button for new api key

