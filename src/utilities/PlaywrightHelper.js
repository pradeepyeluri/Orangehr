const { Locator } = require('playwright')

class PlaywrightHelper
{
    static async click(element)
    {
        try
        {
            await element.click();
        } catch (error)
        {
            const customMessage = "Error clicking on element with locator:" + element + ". Reason is " + error.message;
            throw new Error(customMessage);
        }
    }

    static async fill(element, text)
    {
        try
        {
            await element.fill(text);
            console.log("successfully entered the value: " + text + " in the element: " + element)
        } catch (error)
        {
            const customMessage = "Error filling the text" + text + " in element with locator:" + element + ". Reason is " + error.message;
            throw new Error(customMessage);
        }
    }
}

module.exports = { PlaywrightHelper };