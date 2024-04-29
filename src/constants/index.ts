import { Faker } from '@faker-js/faker';
import { faker } from '@faker-js/faker/locale/en';
import { faker as ruFaker } from '@faker-js/faker/locale/ru';
import { faker as trFaker } from '@faker-js/faker/locale/tr';

export enum Env {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Staging = 'staging'
}


export const regionLanguageMap: { [key: string]: Faker } = {
    USA: faker,
    Russia: ruFaker,
    Turkey: trFaker
};

export const Default = {
    TIMEOUT: 1000
};