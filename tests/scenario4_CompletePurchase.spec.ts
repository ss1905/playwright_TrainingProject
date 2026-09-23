import { test, expect } from "../baseconfig/base-config";

test('SauceLab Login scenario', async ({ page, loginPage, homePage, cartPage, checkoutPage }) => {
    const username = 'standard_user';
    const password = 'secret_sauce';
    //Step 1: Login to application
    console.log('--- STEP 1: LOGIN ---');
    await loginPage.navigateToLoginPage();
    await expect(loginPage.locators().header).toBeVisible();
    await loginPage.locators().textBox("UserName").fill(username);
    await loginPage.locators().textBox("Password").fill(password);
    await loginPage.clickOnLoginButton();
    await expect(homePage.locators().menu).toBeVisible();
    // Screenshot assertion - increased threshold for cross-environment compatibility
    // await expect (page).toHaveScreenshot('home-page.png', { maxDiffPixelRatio: 0.1 });

    //Step 2: Add any two product to the cart Bag pack and Bike Light
    console.info('--- STEP 2: ADD PRODUCTS TO CART ---');
    await expect(homePage.locators().addToCartBagpack).toBeVisible();
    await homePage.locators().addToCartBagpack.click();
    await expect(homePage.locators().addtoCartBikeLight).toBeVisible();
    await homePage.locators().addtoCartBikeLight.click();
    // Verify cart badge shows 2 items
    await expect(homePage.locators().cartBadge).toBeVisible();
    await expect(homePage.locators().cartBadge).toHaveText('2');
    console.info('Cart shows 2 items');

    //Step 3:Navigate to the cart and proceed to checkout.
    console.info('--- STEP 3: NAVIGATE TO CART ---');
    await expect(homePage.locators().cartLink).toBeVisible();
    await homePage.locators().cartLink.click();
    await expect(cartPage.locators().title).toBeVisible();
    await expect(cartPage.locators().title).toHaveText('Your Cart');
    await expect(cartPage.locators().cartItem).toHaveCount(2);
    console.info('Verified 2 products in cart');

    // Verify specific product names in cart
    const backpackInCart = cartPage.locators().cartItemName.filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackInCart).toBeVisible();
    console.info('Sauce Labs Backpack found in cart');
    const bikeLightInCart = cartPage.locators().cartItemName.filter({ hasText: 'Sauce Labs Bike Light' });
    await expect(bikeLightInCart).toBeVisible();
    console.info('Sauce Labs Bike Light found in cart');

    // STEP 4: Enter First Name, Last Name, and Postal Codein the checkout form.
    console.info('--- STEP 4: PROCEED TO CHECKOUT ---');
    await expect(cartPage.locators().checkoutButton).toBeVisible();
    await expect(cartPage.locators().checkoutButton).toBeEnabled();
    await cartPage.locators().checkoutButton.click();
    console.info('Clicked checkout button');

    const checkoutTitle = page.locator('[data-test="title"]');
    await expect(checkoutPage.locators().title).toBeVisible();
    await expect(checkoutPage.locators().title).toHaveText('Checkout: Your Information');
    console.info('Checkout page title verified');

    // Test checkout information
    const firstName = 'John';
    const lastName = 'Doe';
    const postalCode = '12345';
    console.info(`Testing Checkout Info with - Name: ${firstName} ${lastName}, Postal Code: ${postalCode}`);

    // Enter first name, Last name and POst details
    const firstNameInput = page.locator('[data-test="firstName"]');
    await expect(checkoutPage.locators().textBox("First Name")).toBeVisible();
    await checkoutPage.locators().textBox("First Name").fill(firstName);
    await expect(checkoutPage.locators().textBox("Last Name")).toBeVisible();
    await checkoutPage.locators().textBox("Last Name").fill(lastName);
    await expect(checkoutPage.locators().textBox("Zip/Postal Code")).toBeVisible();
    await checkoutPage.locators().textBox("Zip/Postal Code").fill(postalCode);

    //Step 5: Continue to the next step and verify the order summary
    await expect(checkoutPage.locators().continueButton).toBeVisible();
    await checkoutPage.locators().continueButton.click();
    console.info('Clicked continue button');

    // STEP 6: VERIFY ORDER SUMMARY

    // Verify overview page title
    const overviewTitle = checkoutPage.locators().title;
    await expect(overviewTitle).toBeVisible();
    await expect(overviewTitle).toHaveText('Checkout: Overview');
    console.info('Overview page title verified');

    // Verify cart items in overview
    await expect(checkoutPage.locators().inventoryItem).toHaveCount(2);
    console.info('Verified 2 products in order summary');

    // STEP 7: COMPLETE PURCHASE
    // await expect(checkoutPage.locators().finishButton).toBeVisible();
    await checkoutPage.locators().finishButton.scrollIntoViewIfNeeded();
    await checkoutPage.locators().finishButton.click();
    console.info('Clicked finish button');

    // Verify checkout complete page loaded
    await page.waitForURL('**/checkout-complete.html', { timeout: 10000 });
    console.info('Navigated to checkout complete page');
    await expect(checkoutPage.locators().title).toBeVisible();
    await expect(checkoutPage.locators().title).toHaveText('Checkout: Complete!');
    await expect(checkoutPage.locators().orderCompleteHeader).toBeVisible();
    await expect(checkoutPage.locators().orderCompleteHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.locators().orderCompleteText).toBeVisible();
    await expect(checkoutPage.locators().orderCompleteText).toContainText('Your order has been dispatched');
    // Screenshot assertion - increased threshold for cross-environment compatibility
    // await expect(page).toHaveScreenshot('checkout-complete.png', { maxDiffPixelRatio: 0.1 });
    console.info('Order confirmation message verified');

    //Logout from application
    await homePage.locators().menu.click();
    await homePage.locators().menuLogout.click();
});