workflow "New workflow" {
  on = "push"
  resolves = ["test"]
}

action "install" {
  uses = "actions/npm@e7aaefe"
  runs = "npm install"
}

action "lint" {
  uses = "actions/npm@e7aaefe"
  runs = "npm run lint"
  needs = ["install"]
}

action "test" {
  uses = "actions/npm@e7aaefe"
  runs = "npm run test"
  needs = ["lint"]
}
