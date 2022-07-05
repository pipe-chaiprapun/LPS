export class EmpUnitModel {
    unitId: string;
    unitName: string;
    icon: string;
    child: UnitChild[];
}

export class UnitChild {
    unitId: string;
    unitName: string;
    child: UnitChild[];
}

export class UnitChild1 {
    unitId: string;
    unitName: string;
    child: UnitChild2[];
}

export class UnitChild2 {
    unitId: string;
    unitName: string;
}