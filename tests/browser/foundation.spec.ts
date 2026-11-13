import {test,expect} from '@playwright/test';
test('register, onboard, edit, reload, logout and login',async({page})=>{
const email='browser-'+Date.now()+'@example.test';await page.goto('/');await page.getByLabel('Email address').fill(email);await page.getByLabel('Password',{exact:true}).fill('Browser-password-12345');await page.getByRole('button',{name:'Create account'}).click();
await page.getByLabel('Business name').fill('Synthetic Demo Store');await page.getByLabel('City / location').fill('Hyderabad');await page.getByRole('button',{name:'Create my workspace'}).click();await expect(page.getByRole('heading',{name:'Welcome, Synthetic Demo Store.'})).toBeVisible();
await page.getByRole('button',{name:'Manage business profile'}).click();await page.getByLabel('Business name').fill('Synthetic Updated Store');await page.getByRole('button',{name:'Save profile'}).click();await expect(page.getByRole('status')).toContainText('Profile saved');
await page.reload();await expect(page.getByRole('heading',{name:'Welcome, Synthetic Updated Store.'})).toBeVisible();
await page.getByRole('button',{name:'Sign out'}).click();await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByLabel('Email address').fill(email);await page.getByLabel('Password',{exact:true}).fill('Browser-password-12345');await page.getByRole('button',{name:'Sign in',exact:false}).first().click();await expect(page.getByRole('heading',{name:'Welcome, Synthetic Updated Store.'})).toBeVisible();
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});