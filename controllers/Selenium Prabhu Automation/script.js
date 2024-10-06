const { By, Key, Builder, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
var options = new chrome.Options();
require('dotenv').config();
const { findotp } = require('./fetchotpscript');

async function autotransact(receivernameog, receiverbanknameog, receiveracnoog, amountog, sendername) {


    options.addArguments("--start-maximized")

    let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
    // const chromeOptions = new chrome.Options();
    // chromeOptions.addArguments('user-data-dir=C:\\Users\\Jugal\\AppData\\Local\\Google\\Chrome\\User Data');
    // chromeOptions.addArguments('profile-directory=Default');

    // // Create a new instance of the Chrome driver
    // const driver = await new Builder()
    //     .forBrowser('chrome')
    //     .setChromeOptions(chromeOptions)
    //     .build();



    try {


        driver.manage().window().maximize();


        await driver.get('https://ibank.prabhubank.com/#/dashboard');

        let emailField = await driver.wait(until.elementLocated(By.id("username")), 10000);
        await driver.wait(until.elementIsVisible(emailField), 10000);
        await driver.wait(until.elementIsEnabled(emailField), 10000);
        await emailField.sendKeys(process.env.LoginID);


        let passwordfield = await driver.wait(until.elementLocated(By.id("password")), 10000);
        await driver.wait(until.elementIsVisible(passwordfield), 10000);
        await driver.wait(until.elementIsEnabled(passwordfield), 10000);
        await passwordfield.sendKeys(process.env.PASSWORD);

        let submit = await driver.findElement(By.css("[type='submit']"));
        await submit.click();



        const transferbutton = await driver.wait(until.elementLocated(By.xpath('//*[@id="side-navi"]/div[1]/div/div/div/ul/li[5]/a')), 10000);
        await driver.wait(until.elementIsVisible(transferbutton), 10000);
        await driver.wait(until.elementIsEnabled(transferbutton), 10000);
        transferbutton.click()


        const cipsbutton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[6]/ul/li[2]/a/tab-heading')), 10000);
        await driver.wait(until.elementIsVisible(cipsbutton), 10000);
        await driver.wait(until.elementIsEnabled(cipsbutton), 10000);
        await cipsbutton.click();

        const receivername = await driver.wait(until.elementLocated(By.id('toAccountHolderName')), 10000);
        await receivername.sendKeys(receivernameog);

        const amount = await driver.wait(until.elementLocated(By.id('amount')), 10000);
        await amount.sendKeys(amountog);

        const remarks = await driver.wait(until.elementLocated(By.id('remarks')), 10000);
        await remarks.sendKeys(`From ${sendername}`);

        const receiveracnumber = await driver.wait(until.elementLocated(By.id('toAccountNumber')), 10000);
        await receiveracnumber.sendKeys(receiveracnoog);





        await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[1]/div[1]/div/div/div[2]/form/div[2]/div/a/span[1]')), 10000);
        const banknamebutton = await driver.findElement(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[1]/div[1]/div/div/div[2]/form/div[2]/div/a/span[1]'));
        banknamebutton.click()

        await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[1]/div[1]/div/div/div[2]/form/div[2]/div/div/div[1]/input')), 10000);
        const banknamefield = await driver.findElement(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[1]/div[1]/div/div/div[2]/form/div[2]/div/div/div[1]/input'));
        banknamefield.click()

        await driver.actions()
            .sendKeys(receiverbanknameog)
            .keyDown(Key.ENTER)
            .perform()

        await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[1]/div[1]/div/div/div[2]/form/div[7]/button[1]')), 10000);
        const submitbutton = await driver.findElement(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[1]/div[1]/div/div/div[2]/form/div[7]/button[1]'));
        submitbutton.click()


        const confirmButtonXPath = '/html/body/div[1]/div/main/section/div/div/div[7]/div[2]/div/div/div[2]/div[1]/div[4]/div/a';
        let confirmbutton;

        let retries = 20; // Retry up to 3 times
        while (retries > 0) {
            try {
                confirmbutton = await driver.wait(until.elementLocated(By.xpath(confirmButtonXPath)), 100000);
                await driver.wait(until.elementIsVisible(confirmbutton), 10000);
                await driver.wait(until.elementIsEnabled(confirmbutton), 10000);

                await confirmbutton.click(); // Try clicking the button
                console.log("Button clicked successfully.");
                break; // If successful, break out of the loop
            } catch (error) {
                if (error.name === 'StaleElementReferenceError') {
                    console.log("StaleElementReferenceError occurred, retrying...");
                    retries--; // Decrement retry count
                    if (retries === 0) {
                        throw error; // Re-throw if retries are exhausted
                    }
                } else {
                    // If another type of error occurs, handle it or throw it
                    throw error;
                }
            }
        }



        const otp = await findotp()

        let otpfield = await driver.wait(until.elementLocated(By.id("otp")), 10000);
        await driver.wait(until.elementIsVisible(otpfield), 10000);
        await driver.wait(until.elementIsEnabled(otpfield), 10000);
        await otpfield.sendKeys(otp);

        await driver.actions()
            .keyDown(Key.ENTER)
            .perform()


        let downloadpdfbtn = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[7]/div[3]/div/div/div/div[1]/file-download-component/div/button')), 10000);
        if (downloadpdfbtn) {
            console.log('Download pdf button found, transaction was successful')
        }


        let servicesretries = 200; // Retry up to 3 times
        while (servicesretries > 0) {
            try {
                servicesbtn = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[1]/div/aside/div[1]/div[1]/div/div/div/ul/li[4]/a`)), 100000);
                await driver.wait(until.elementIsVisible(servicesbtn), 10000);
                await driver.wait(until.elementIsEnabled(servicesbtn), 10000);

                await servicesbtn.click(); // Try clicking the button
                console.log("Button clicked successfully.");
                break; // If successful, break out of the loop
            } catch (error) {

                console.log("Error occurred, retrying...");
                servicesretries--; // Decrement retry count
                if (servicesretries === 0) {
                    throw error; // Re-throw if retries are exhausted
                }

            }
        }



        const reportbtn = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[2]/div[2]/div/div[3]/div[2]/a')), 10000);
        await driver.wait(until.elementIsVisible(reportbtn), 10000);
        await driver.wait(until.elementIsEnabled(reportbtn), 10000);
        await reportbtn.click();

        const transferlogbtn = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[2]/div[3]/ul/li[2]/a')), 10000);
        await driver.wait(until.elementIsVisible(transferlogbtn), 10000);
        await driver.wait(until.elementIsEnabled(transferlogbtn), 10000);
        await transferlogbtn.click();


        const formattedDate = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}`;

        let fromfield = await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/main/section/div/div/div[2]/div[3]/div/div[2]/div/div/div/div/div/div[1]/div/div/form/div[1]/div/div/div/div/input")), 10000);
        await driver.wait(until.elementIsVisible(fromfield), 10000);
        await driver.wait(until.elementIsEnabled(fromfield), 10000);
        await fromfield.click();
        await driver.actions()
            .keyDown(Key.CONTROL)
            .sendKeys('a')
            .keyUp(Key.CONTROL)
            .keyDown(Key.BACK_SPACE)
            .perform()
        await fromfield.sendKeys(formattedDate);
        await driver.sleep(500);
        await driver.actions()
            .keyDown(Key.ENTER)
            .perform()



            await driver.sleep(500);
        let showretries = 5; // Retry up to 5 times
        while (showretries > 0) {
            try {
                showbutton = await driver.wait(until.elementLocated(By.xpath(`/html/body/div[1]/div/main/section/div/div/div[2]/div[3]/div/div[2]/div/div/div/div/div/div[1]/div/div[2]/form/div[3]/button`)), 10000);
                await driver.wait(until.elementIsVisible(showbutton), 10000);
                await driver.wait(until.elementIsEnabled(showbutton), 10000);

                await showbutton.click(); // Try clicking the button
                console.log("Button clicked successfully.");
                break; // If successful, break out of the loop
            } catch (error) {

                console.log("Error occurred, retrying...");
                showretries--; // Decrement retry count
                if (showretries === 0) {
                    throw error; // Re-throw if retries are exhausted
                }

            }
        }







        // const showbutton = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[2]/div[3]/div/div[2]/div/div/div/div/div/div[1]/div/div[2]/form/div[3]/button')), 10000);
        // await driver.wait(until.elementIsVisible(showbutton), 10000);
        // await driver.wait(until.elementIsEnabled(showbutton), 10000);
        // await showbutton.click();
















        // let tofield = await driver.wait(until.elementLocated(By.xpath("/html/body/div[1]/div/main/section/div/div/div[2]/div[3]/div/div[2]/div/div/div/div/div/div[1]/div/div/form/div[2]/div/div/div/div/input")), 10000);
        // await driver.wait(until.elementIsVisible(tofield), 10000);
        // await driver.wait(until.elementIsEnabled(tofield), 10000);
        // await tofield.click();
        // await driver.actions()
        // .keyDown(Key.CONTROL)
        // .sendKeys('a')
        // .keyUp(Key.CONTROL)
        // .keyDown(Key.BACK_SPACE)
        // .perform()
        // await tofield.sendKeys(formattedDate);
        // await driver.actions()
        // .keyDown(Key.ENTER)
        // .perform()



        
        const lasttransaction = await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/div/main/section/div/div/div[2]/div[3]/div/div[2]/div/div/div/div/div/div[2]/div/div[2]/div/div/table/tbody/tr[1]/td[1]')), 10000);
        await driver.wait(until.elementIsVisible(lasttransaction), 10000);
        await driver.wait(until.elementIsEnabled(lasttransaction), 10000);
        const lastTransactionText = await lasttransaction.getText();

        return lastTransactionText


        await driver.sleep(100000);
    } catch (err) {
        console.log("Error in autotransact ", err);
        await driver.sleep(100000);
    } finally {

        await driver.quit();
    }
}


module.exports = {
    autotransact
};

