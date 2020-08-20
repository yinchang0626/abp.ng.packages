export const enum Exception {
  FileNotFound = '[File Not Found] There is no file at "{0}" path.',
  InvalidModule = '[Invalid Module] Backend module "{0}" does not exist in API definition.',
  InvalidWorkspace = '[Invalid Workspace] The angular.json should be a valid JSON file.',
  NoApi = '[API Not Available] Please double-check the URL in the source project environment and make sure your application is up and running.',
  NoApiDefinition = '[API Definition Not Found] There is no valid API definition file at "{0}".',
  NoProject = '[Project Not Found] Either define a default project in your workspace or specify the project name in schematics options.',
  NoTypeDefinition = '[Type Definition Not Found] There is no type definition for "{0}".',
  NoWorkspace = '[Workspace Not Found] Make sure you are running schematics at the root directory of your workspace and it has an angular.json file.',
  NoEnvironment = '[Environment Not Found] An environment file cannot be located in "{0}" project.',
  NoApiUrl = '[API URL Not Found] Cannot resolve API URL for "{1}" module from "{0}" project.',
}
