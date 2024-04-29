import { Faker } from '@faker-js/faker';
import { Record } from '../interfaces';
import { addCharacter, deleteCharacter, swapCharacters } from '../utils';

interface MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void;
}

class AddCharacterStrategy implements MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void {
        record[randomField] = addCharacter(record[randomField], randomCharIndex);
    }
}

class DeleteCharacterStrategy implements MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void {
        record[randomField] = deleteCharacter(record[randomField], randomCharIndex);
    }
}

class SwapCharactersStrategy implements MisspellingStrategy {
    execute(record: Record, randomField: keyof Record, randomCharIndex: number): void {
        record[randomField] = swapCharacters(record[randomField], randomCharIndex);
    }
}

export default class Generator {
    private strategies: MisspellingStrategy[];

    constructor(private languageModule: Faker) {
        this.strategies = [
            new AddCharacterStrategy(),
            new DeleteCharacterStrategy(),
            new SwapCharactersStrategy()
        ];
    }

    private generateRandomInt(max: number): number {
        return Math.floor(this.languageModule.number.float(max));
    }

    private getRandomField(record: Record): keyof Record {
        const fields = Object.keys(record) as (keyof Record)[];
        return fields[this.generateRandomInt(fields.length)];
    }

    private getRandomCharIndex(field: string): number {
        return this.generateRandomInt(field.length);
    }

    private executeRandomStrategy(record: Record) {
        const errorVariant = this.generateRandomInt(3);
        const randomField = this.getRandomField(record);
        const randomCharIndex = this.getRandomCharIndex(record[randomField]);

        this.strategies[errorVariant].execute(record, randomField, randomCharIndex);
    }

    generate(errorCount: number, record: Record): Record {
        const integerPart = Math.trunc(errorCount);
        const fractionalPart = errorCount % 1;

        for (let i = 0; i < integerPart; i++) {
            this.executeRandomStrategy(record);
        }

        if (fractionalPart > this.languageModule.number.float(1)) {
            this.executeRandomStrategy(record);
        }

        return record;
    }
}
