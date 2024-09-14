#!/usr/bin/env node

console.log('Hello from asd CLI!');

import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const program = new Command();

interface SetupOptions {
  username: string;
  password: string;
}

program
  .command('server')
  .description('Server-related commands')
  .addCommand(
    new Command('setup')
      .description('Setup a local Docker registry with authentication')
      .requiredOption('-u, --username <username>', 'Username for registry authentication')
      .requiredOption('-p, --password <password>', 'Password for registry authentication')
      .action((options: SetupOptions) => {
        const { username, password } = options;
    
        // Create auth directory if it doesn't exist
        const authDir = path.join(process.cwd(), 'auth');
        if (!fs.existsSync(authDir)) {
          fs.mkdirSync(authDir);
        }

        // Create htpasswd file
        const htpasswdPath = path.join(authDir, 'htpasswd');
        execSync(`docker run --entrypoint htpasswd httpd:2 -Bbn ${username} ${password} > ${htpasswdPath}`);

        // Start Docker registry
        console.log('Starting Docker registry...');
        execSync(`docker run -d \
          -p 5127:5000 \
          --restart=always \
          --name registry \
          -v ${authDir}:/auth \
          -e "REGISTRY_AUTH=htpasswd" \
          -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
          -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
          registry:2`, { stdio: 'inherit' });

        console.log('Local Docker registry setup complete.');
        console.log(`Registry is running on localhost:5127`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
      })
  );

program.parse(process.argv);

// Add your CLI logic here