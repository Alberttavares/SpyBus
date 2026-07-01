import { Report } from "@/types";
import { PointData } from "@/constants/points";

export interface EstimationResult {
  estimatedLocation: string;
  confidence: "high" | "medium" | "low";
  betweenPoints: boolean;
  fromPoint: string | null;
  toPoint: string | null;
}

export function estimateBusLocation(
  reports: Report[],
  points: PointData[]
): EstimationResult {
  if (reports.length === 0) {
    return {
      estimatedLocation: "Nenhuma informação disponível",
      confidence: "low",
      betweenPoints: false,
      fromPoint: null,
      toPoint: null,
    };
  }

  const sortedReports = [...reports].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  const recentReports = sortedReports.slice(-10);

  const pointsOrderMap = new Map<string, number>();
  points.forEach((p) => pointsOrderMap.set(p.id, p.order));

  const lastReportByPoint = new Map<string, Report>();
  recentReports.forEach((r) => {
    lastReportByPoint.set(r.pointId, r);
  });

  const lastReport = recentReports[recentReports.length - 1];
  const lastPointOrder = pointsOrderMap.get(lastReport.pointId) ?? 0;

  const hasPassou = lastReport.passou;
  const hasEntrou = lastReport.entrou;

  const earlierReports = recentReports.filter(
    (r) => r.pointId !== lastReport.pointId && r.timestamp < lastReport.timestamp
  );

  const prevReport = earlierReports.length > 0
    ? earlierReports[earlierReports.length - 1]
    : null;

  if (hasEntrou && !hasPassou) {
    const nextPoints = points
      .filter((p) => (pointsOrderMap.get(p.id) ?? 0) > lastPointOrder)
      .slice(0, 2);

    if (nextPoints.length > 0) {
      const nextPoint = nextPoints[0];
      if (prevReport) {
        return {
          estimatedLocation: `Entre ${prevReport.pointName} e ${lastReport.pointName}`,
          confidence: "medium",
          betweenPoints: true,
          fromPoint: prevReport.pointName,
          toPoint: lastReport.pointName,
        };
      }
      return {
        estimatedLocation: `Próximo a ${lastReport.pointName} (embarcando)`,
        confidence: "high",
        betweenPoints: false,
        fromPoint: lastReport.pointName,
        toPoint: nextPoint.name,
      };
    }
  }

  if (hasPassou) {
    const nextPoints = points
      .filter((p) => (pointsOrderMap.get(p.id) ?? 0) > lastPointOrder)
      .slice(0, 2);

    if (prevReport) {
      const prevOrder = pointsOrderMap.get(prevReport.pointId) ?? 0;
      if (prevOrder < lastPointOrder) {
        return {
          estimatedLocation: `Entre ${prevReport.pointName} e ${lastReport.pointName}`,
          confidence: "medium",
          betweenPoints: true,
          fromPoint: prevReport.pointName,
          toPoint: lastReport.pointName,
        };
      }
    }

    if (nextPoints.length > 0) {
      return {
        estimatedLocation: `Passou por ${lastReport.pointName} — seguindo para ${nextPoints[0].name}`,
        confidence: "medium",
        betweenPoints: true,
        fromPoint: lastReport.pointName,
        toPoint: nextPoints[0].name,
      };
    }

    return {
      estimatedLocation: `Passou por ${lastReport.pointName}`,
      confidence: "medium",
      betweenPoints: false,
      fromPoint: lastReport.pointName,
      toPoint: null,
    };
  }

  const reportCount = new Set(reports.map((r) => r.pointId)).size;
  const uniquePoints = points.length;

  if (reportCount >= 2 && lastReport.pointId !== points[0]?.id) {
    const coveredPoints = points.filter((p) =>
      recentReports.some((r) => r.pointId === p.id)
    );
    const lastCovered = coveredPoints[coveredPoints.length - 1];
    const nextUncovered = points.find(
      (p) =>
        (pointsOrderMap.get(p.id) ?? 0) >
          (pointsOrderMap.get(lastCovered?.id ?? "") ?? 0) &&
        !recentReports.some((r) => r.pointId === p.id)
    );

    if (lastCovered && nextUncovered) {
      return {
        estimatedLocation: `Entre ${lastCovered.name} e ${nextUncovered.name}`,
        confidence: "medium",
        betweenPoints: true,
        fromPoint: lastCovered.name,
        toPoint: nextUncovered.name,
      };
    }
  }

  return {
    estimatedLocation: `Última atualização em ${lastReport.pointName}`,
    confidence: "low",
    betweenPoints: false,
    fromPoint: lastReport.pointName,
    toPoint: null,
  };
}
