export default async (field, keys) => {
    for (const letter of keys.toString().split("")) {
        await field.sendKeys(letter);
    }
};
