import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routes } from '../src/app/routes';

const read = (p: string) => readFileSync(p, 'utf8');

describe('route splitting', () => {
  it('does not import AuthContext or supabase from the public tree', () => {
    expect(read('src/app/App.tsx')).not.toContain('AuthProvider');
    expect(read('src/components/public/PublicHeader.tsx')).not.toContain('lib/storage');
  });

  it('lazy-loads every non-home route', () => {
    const src = read('src/app/routes.tsx');
    expect(src).not.toMatch(/import \{[^}]*\} from '\.\.\/features\/admin\//);
    expect(src).toMatch(/lazy\(\(\) => import\('\.\.\/features\/admin\/OverviewPage'\)/);
    expect(src).not.toMatch(/import \{[^}]*\} from '\.\.\/features\/public\/(?!HomePage)/);
    expect(src).not.toMatch(/import \{ LoginPage \}/);
  });

  it('renders the home route without auth', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Thekkanath Souparnika');
  });
});
