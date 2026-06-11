import { beforeEach, describe, expect, it } from 'vitest';
import {
  formatCurrency,
  getNumericValue,
  collectValues,
  getUsernameValidationState,
  validateUsername,
  updateTotals,
} from './script.js';

describe('Bucks2Bar utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <div id="total-income"></div>
        <div id="total-expense"></div>
        <div id="chart-total-income"></div>
        <div id="chart-total-expense"></div>
        <div id="chart-net"></div>
      </div>
    `;

    const tbody = document.createElement('tbody');
    tbody.id = 'month-table-body';
    document.body.appendChild(tbody);

    for (let i = 0; i < 12; i++) {
      const incomeInput = document.createElement('input');
      incomeInput.type = 'number';
      incomeInput.id = `income-${i}`;
      incomeInput.value = '0.00';
      document.body.appendChild(incomeInput);

      const expenseInput = document.createElement('input');
      expenseInput.type = 'number';
      expenseInput.id = `expense-${i}`;
      expenseInput.value = '0.00';
      document.body.appendChild(expenseInput);
    }
  });

  it('formats values as USD currency', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-12.3)).toBe('-$12.30');
  });

  it('validates username rules correctly', () => {
    expect(validateUsername('User1!')).toBe(true);
    expect(validateUsername('user')).toBe(false);
    expect(validateUsername('User!')).toBe(false);
    expect(validateUsername('User1')).toBe(false);

    expect(getUsernameValidationState('User1!')).toEqual({
      length: true,
      uppercase: true,
      number: true,
      special: true,
    });

    expect(getUsernameValidationState('user')).toEqual({
      length: false,
      uppercase: false,
      number: false,
      special: false,
    });
  });

  it('parses numeric input values safely', () => {
    const input = document.getElementById('income-0');
    input.value = '42.75';
    expect(getNumericValue('income-0')).toBe(42.75);

    input.value = '-10';
    expect(getNumericValue('income-0')).toBe(0);

    input.value = 'abc';
    expect(getNumericValue('income-0')).toBe(0);
  });

  it('returns zero when a numeric input does not exist', () => {
    expect(getNumericValue('missing-input')).toBe(0);
  });

  it('collects monthly income and expense values across all months', () => {
    document.getElementById('income-0').value = '10.00';
    document.getElementById('expense-0').value = '3.50';
    document.getElementById('income-1').value = '20';
    document.getElementById('expense-1').value = '5';
    document.getElementById('income-2').value = 'abc';
    document.getElementById('expense-2').value = '-10';

    const values = collectValues();
    expect(values[0]).toEqual({ income: 10, expense: 3.5 });
    expect(values[1]).toEqual({ income: 20, expense: 5 });
    expect(values[2]).toEqual({ income: 0, expense: 0 });
    expect(values).toHaveLength(12);
  });

  it('updates totals in the DOM with positive and negative net values', () => {
    updateTotals([
      { income: 100, expense: 40 },
      { income: 200, expense: 80 },
    ]);

    expect(document.getElementById('total-income').textContent).toBe('$300.00');
    expect(document.getElementById('total-expense').textContent).toBe('$120.00');
    expect(document.getElementById('chart-total-income').textContent).toBe('$300.00');
    expect(document.getElementById('chart-total-expense').textContent).toBe('$120.00');
    expect(document.getElementById('chart-net').textContent).toBe('$180.00');
    expect(document.getElementById('chart-net').classList.contains('text-success')).toBe(true);

    updateTotals([
      { income: 50, expense: 80 },
      { income: 10, expense: 40 },
    ]);

    expect(document.getElementById('chart-net').textContent).toBe('-$60.00');
    expect(document.getElementById('chart-net').classList.contains('text-danger')).toBe(true);
  });
});
