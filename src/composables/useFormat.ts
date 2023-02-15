import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
//import advancedFormat from "dayjs/plugin/advancedFormat";
import { Comprobante } from '../types/fiscal';

export default function () {
  dayjs.extend(customParseFormat);
  //dayjs.extend(advancedFormat);

  const fmtDateTime = (
    dateString: string | null | undefined,
    format_output = 'DD/MM/YYYY',
    format_input: string | string[] = [
      'YYYY-MM-DD',
      'YYYY-MM-DD HH:mm:ss',
      'YYYY-MM-DDTHH:mm:ss',
    ]
  ) => {
    if (!dateString) return '';
    // si viene con separador T y con segundos, le saco los milisegundos la parte decimal
    const f_h = dateString.split('T');
    if (f_h.length == 2) {
      const s_m = f_h[1].split('.');
      if (s_m.length == 2) {
        dateString = f_h[0] + 'T' + s_m[0];
      }
    }

    const date = dayjs(dateString, format_input, true);
    return date.format(format_output);
  };

  const toDateFromDB = (dateString: string, inputFormat = 'YYYY-MM-DD') => {
    return dayjs(dateString, inputFormat);
  };

  const fmtDateFromDB = (
    dateString: string | null | undefined,
    format_output = 'DD/MM/YYYY'
  ) => {
    return fmtDateTime(dateString, format_output);
  };

  const fmtDateTimeFromDB = (
    dateString: string,
    format = 'DD/MM/YYYY HH:mm:ss'
  ) => {
    return fmtDateFromDB(dateString, format);
  };

  const fmtDateToDB = (
    date: Date | string | null = null,
    inputFormat = 'DD/MM/YYYY',
    outputFormat = 'YYYY-MM-DD'
  ) => {
    date = date || new Date();
    let d = null;
    if (typeof date === 'string') {
      d = dayjs(date, inputFormat);
    } else {
      // es un Date
      d = dayjs(date);
    }
    return d.format(outputFormat);
  };

  const fmtDateTimeToDB = (
    date: Date | null = null,
    inputFormat = 'DD/MM/YYYY HH:mm:ss',
    outputFormat = 'YYYY-MM-DD HH:mm:ss'
  ) => {
    return fmtDateToDB(date, inputFormat, outputFormat);
  };

  const getDateRange = (
    start_date: Date | string | null = null,
    inc_days = 0,
    inputFormat = 'DD/MM/YYYY'
  ) => {
    start_date = start_date || new Date();
    let d = null;
    if (typeof start_date === 'string') {
      d = dayjs(start_date, inputFormat);
    } else {
      // es un Date
      d = dayjs(start_date);
    }
    return [d, d.add(inc_days, 'day')];
  };

  const getDateRangeFormatted = (
    start_date: Date | string | null = null,
    inc_days = 0,
    inputFormat = 'DD/MM/YYYY',
    outputFormat = 'YYYY-MM-DD'
  ): [string, string] => {
    const ret = getDateRange(start_date, inc_days, inputFormat);
    return [ret[0].format(outputFormat), ret[1].format(outputFormat)];
  };

  const getDateRangeOfMonth = (
    date: Date | string | null = null,
    inputFormat = 'DD/MM/YYYY'
  ) => {
    date = date || new Date();
    let d = null;
    if (typeof date === 'string') {
      d = dayjs(date, inputFormat);
    } else {
      // es un Date
      d = dayjs(date);
    }
    return [d.startOf('month'), d.endOf('month')];
  };

  const getDateRangeOfMonthFormatted = (
    date: Date | string | null = null,
    inputFormat = 'DD/MM/YYYY',
    outputFormat = 'YYYY-MM-DD'
  ): [string, string] => {
    const ret = getDateRangeOfMonth(date, inputFormat);
    return [ret[0].format(outputFormat), ret[1].format(outputFormat)];
  };

  const getDateRangeTodayFormatted = (
    outputFormat = 'YYYY-MM-DD'
  ): [string, string] => {
    const today = dayjs(new Date()).format(outputFormat);
    return [today, today];
  };

  const fmtNumber = (
    value: number | string,
    decimal_dig = 2,
    comma_sep = ','
  ) => {
    value = value || 0;
    if (typeof value == 'string') value = parseFloat(value);
    return value
      .toFixed(decimal_dig)
      .replace(/\B(?=(\d{3})+(?!\d))/g, comma_sep);
  };

  const fmtImporte = (value: number | string, currencySymbol = '$') => {
    return (
      (currencySymbol ? currencySymbol + ' ' : '') + fmtNumber(value, 2, ',')
    );
  };

  const toFloat = (value: number | string | null) => {
    value = value || 0;
    if (typeof value == 'string') value = parseFloat(value);
    return value;
  };

  const toInt = (value: number | string | null) => {
    value = value || 0;
    if (typeof value == 'string') value = parseInt(value, 10);
    return Math.trunc(value);
  };

  const fmtNroComprobante = (
    comp: Comprobante,
    show_abreviatura = false
  ): string => {
    let ret = '';
    if (comp && comp.puntoVenta && comp.numero) {
      ret =
        (show_abreviatura && comp.tipoLetra?.comprobanteTipo?.abreviatura
          ? comp.tipoLetra?.comprobanteTipo?.abreviatura + ' '
          : '') +
        (comp.letra ? comp.letra + ' ' : '') +
        String(comp.puntoVenta.numero).padStart(3, '0') +
        '-' +
        String(comp.numero).padStart(8, '0');
    }
    return ret;
  };

  const parseCurrency = (input: string) => {
    const nums = input.replace(/(,|\$|\s|\%)/g, '').trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
    return nums === '' ? null : Number.NaN;
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return '';
    return fmtImporte(value);
  };

  const zeroPad = (num: number, places: number) =>
    String(num).padStart(places, '0');

  const removeTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  return {
    fmtDateTime,
    fmtDateFromDB,
    fmtDateTimeFromDB,
    fmtDateToDB,
    fmtDateTimeToDB,
    toDateFromDB,
    getDateRangeOfMonth,
    getDateRangeOfMonthFormatted,
    getDateRangeTodayFormatted,
    getDateRange,
    getDateRangeFormatted,
    fmtNumber,
    fmtImporte,
    toFloat,
    toInt,
    fmtNroComprobante,
    parseCurrency,
    formatCurrency,
    zeroPad,
    removeTime,
  };
}
