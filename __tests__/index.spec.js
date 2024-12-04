import MockDate from 'mockdate';
import MockTimezone from 'timezone-mock';
import unitTestingTask from '../unitTestingTask'


describe('unitTestingTask', () => {
    beforeEach(() => {
        const utcDate = new Date(Date.UTC(2024, 1, 5, 1, 2, 3, 4));
        MockDate.set(utcDate);
    });

    afterEach(() => {
        MockTimezone.unregister();
        MockDate.reset();
    });

    describe('General behaviour', () => {
        test('should replace format string with values from date', () => {
            expect(unitTestingTask('YYYY-MM-dd')).toBe('2024-02-05');
        });

        test('should replace only supported tokens in format string', () => {
            expect(unitTestingTask('YYYY-QWERTY-dd')).toBe('2024-QWERTY-05');
        })
    })


    describe('Input validation', () => {
        test('should handle Date object as input', () => {
            expect(unitTestingTask('YYYY-MM-dd', new Date())).toBe("2024-02-05");
        });

        test('should handle Unix timestamp as input', () => {
            expect(unitTestingTask('YYYY-MM-dd', Date.parse('2024-02-05'))).toBe("2024-02-05");
        });

        test('should handle ISO date string as input', () => {
            expect(unitTestingTask('YYYY-MM-dd', '2024-02-05T00:00:00Z')).toBe("2024-02-05");
        });

        test('should default to current date if date was not provided', () => {
            expect(unitTestingTask('YYYY-MM-dd')).toBe("2024-02-05");
        })

        test('should throw typeError if format string has invalid format', () => {
            const invalidFormats = [123, true, [], {}, null, undefined, NaN];

            invalidFormats.forEach((invalidFormat) => {
                expect(() => {
                    unitTestingTask(invalidFormat)
                }).toThrow(new TypeError('Argument `format` must be a string'));
            })
        })

        test('should throw typeError if date has invalid format', () => {
            const invalidDates = [null, {}, [], true];

            invalidDates.forEach((invalidDate) => {
                expect(() => {
                    unitTestingTask('YYYY-MM-dd', invalidDate)
                }).toThrow(new TypeError('Argument `date` must be instance of Date or Unix Timestamp or ISODate String'));
            })
        })
    })

    describe('Tokens validation', () => {

        describe('Year', () => {
            test('YYYY', () => {
                expect(unitTestingTask('YYYY')).toBe('2024');
            })

            test('YY', () => {
                expect(unitTestingTask('YY')).toBe('24');
            })
        })

        describe('Month', () => {
            test('MMMM', () => {
                expect(unitTestingTask('MMMM')).toBe('February');
            })

            test('MMM', () => {
                expect(unitTestingTask('MMM')).toBe('Feb');
            })

            test('MM', () => {
                expect(unitTestingTask('MM')).toBe('02');
            })

            test('M', () => {
                expect(unitTestingTask('M')).toBe('2');
            })
        })

        describe('Day', () => {
            test('DDD', () => {
                expect(unitTestingTask('DDD')).toBe('Monday');
            })

            test('DD', () => {
                expect(unitTestingTask('DD')).toBe('Mon');
            })

            test('D', () => {
                expect(unitTestingTask('D')).toBe('Mo');
            })

            test('dd', () => {
                expect(unitTestingTask('dd')).toBe('05');
            })

            test('d', () => {
                expect(unitTestingTask('d')).toBe('5');
            })
        })

        describe('Hour', () => {
            test('HH', () => {
                MockTimezone.register('UTC');
                expect(unitTestingTask('HH')).toBe('01');
            })

            test('H', () => {
                MockTimezone.register('UTC');
                expect(unitTestingTask('H')).toBe('1');
            })

            test('hh', () => {
                MockTimezone.register('UTC');
                expect(unitTestingTask('hh')).toBe('01');
            })

            test('h', () => {
                MockTimezone.register('UTC');
                expect(unitTestingTask('h')).toBe('1');
            })
        })

        describe('Minute', () => {
            test('mm', () => {
                expect(unitTestingTask('mm')).toBe('02');
            })

            test('m', () => {
                expect(unitTestingTask('m')).toBe('2');
            })
        })

        describe('Second', () => {
            test('ss', () => {
                expect(unitTestingTask('ss')).toBe('03');
            })

            test('s', () => {
                expect(unitTestingTask('s')).toBe('3');
            })
        })

        describe('Millisecond', () => {
            test('ff', () => {
                expect(unitTestingTask('ff')).toBe('004');
            })

            test('f', () => {
                expect(unitTestingTask('f')).toBe('4');
            })
        })

        describe('AM', () => {
            test('A', () => {
                expect(unitTestingTask('A')).toBe('AM');
            })

            test('a', () => {
                expect(unitTestingTask('a')).toBe('am');
            })
        })

        describe('PM', () => {
            test('A', () => {
                const date = new Date();
                date.setHours(15);

                expect(unitTestingTask('A', date)).toBe('PM');
            })

            test('a', () => {
                const date = new Date();
                date.setHours(15);

                expect(unitTestingTask('a', date)).toBe('pm');
            })
        })

        describe('Timezone', () => {
            test('ZZ', () => {
                MockTimezone.register('US/Eastern');
                expect(unitTestingTask('ZZ')).toBe('-0500');
            })

            test('Z', () => {
                MockTimezone.register('US/Eastern');
                expect(unitTestingTask('Z')).toBe('-05:00');
            })
        })
    })

    describe('Customs formatters validation', () => {
        test('ISODate', () => {
            MockTimezone.register('UTC');
            expect(unitTestingTask('ISODate')).toBe('2024-02-05');
        })

        test('ISOTime', () => {
            MockTimezone.register('UTC');
            expect(unitTestingTask('ISOTime')).toBe('01:02:03');
        })

        test('ISODateTime', () => {
            MockTimezone.register('UTC');
            expect(unitTestingTask('ISODateTime')).toBe('2024-02-05T01:02:03');
        })

        test('ISODateTimeTZ', () => {
            MockTimezone.register('UTC');
            expect(unitTestingTask('ISODateTimeTZ')).toBe('2024-02-05T01:02:03+00:00');
        })
    })
})
