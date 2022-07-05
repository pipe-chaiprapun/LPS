export class GetKpiModel {
    date: Date;
    kpi: KpiModel[];
}

export class KpiModel {
    TOPIC: string;
    LOAN_TARGET: number;
    YTD: number;
    DIFF: number;
    ACTUAL: number;
    ASDATE: string;
}