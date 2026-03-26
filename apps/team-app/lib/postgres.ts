import { Pool } from "pg";

let pool: Pool | null = null;

function requireDatabaseUrl() {
  const value = process.env.DATABASE_URL;

  if (!value) {
    throw new Error("Missing environment variable: DATABASE_URL");
  }

  return value;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: requireDatabaseUrl(),
    });
  }

  return pool;
}

async function relationExists(db: Pool, relationName: string) {
  const result = await db.query<{ exists: string | null }>(
    `
      select to_regclass($1)::text as exists
    `,
    [relationName],
  );

  return Boolean(result.rows[0]?.exists);
}

export async function hasRelation(relationName: string) {
  return relationExists(getPool(), relationName);
}

async function columnExists(
  db: Pool,
  tableName: string,
  columnName: string,
  schema = "public",
) {
  const result = await db.query<{ exists: boolean }>(
    `
      select exists (
        select 1
        from information_schema.columns
        where table_schema = $1
          and table_name = $2
          and column_name = $3
      ) as exists
    `,
    [schema, tableName, columnName],
  );

  return Boolean(result.rows[0]?.exists);
}

function formatInteger(value: string | null | undefined) {
  if (!value) {
    return "N/A";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return value;
  }

  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export type PollingStationRecord = {
  pollingStationCode: string;
  pollingStationNumber: number;
  placeName: string;
  address: string | null;
  isCentralizer: boolean;
  geometryType: string | null;
  hasValidatedResults: boolean;
  inscrits2026: number | null;
  votants2026: number | null;
  exprimes2026: number | null;
  topCandidateLabel: string | null;
  topCandidateGroup: string | null;
  topCandidateVotes: number | null;
};

export type DashboardData = {
  stats: Array<{ label: string; value: string; tone?: "default" | "accent" | "pine" }>;
  actionItems: Array<{
    label: string;
    summary: string;
    href: string;
    tone?: "default" | "accent" | "pine";
  }>;
  priorityHighlights: Array<{
    label: string;
    value: string;
    summary: string;
    tone?: "default" | "accent" | "pine";
  }>;
  sectorAlerts: Array<{
    sectorLabel: string;
    ownerName: string | null;
    reportCount: number;
    urgentCount: number;
    priorityScore: number;
  }>;
  upcomingMeetings: Array<{
    title: string;
    startsAtLabel: string;
    location: string | null;
  }>;
  recentActivity: Array<{
    kind: string;
    title: string;
    summary: string;
    happenedAtLabel: string;
  }>;
  teamHighlights: Array<{
    label: string;
    value: string;
    summary: string;
  }>;
};

export type UserAdminData = {
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    orgFunctionId: string | null;
    orgFunctionLabel: string | null;
    passwordUpdatedAt: string | null;
    directPermissionIds: string[];
    effectivePermissionCodes: string[];
  }>;
  orgFunctions: Array<{
    id: string;
    code: string;
    label: string;
  }>;
  permissions: Array<{
    id: string;
    code: string;
    label: string;
    module: string;
  }>;
};

export type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueAtLabel: string | null;
  ownerName: string | null;
  assignedTo: string | null;
  sourceFieldReportId: string | null;
  sourceFieldReportTopic: string | null;
};

export type MeetingListItem = {
  id: string;
  title: string;
  description: string | null;
  startsAtLabel: string;
  location: string | null;
  status: string;
  createdByName: string | null;
  notesCount: number;
  openActionsCount: number;
  notes: Array<{
    id: string;
    body: string;
    authorName: string | null;
    createdAtLabel: string;
  }>;
  actions: Array<{
    id: string;
    title: string;
    ownerName: string | null;
    dueAtLabel: string | null;
    isDone: boolean;
  }>;
};

export type FieldReportListItem = {
  id: string;
  citizenId: string | null;
  citizenName: string | null;
  neighborhood: string | null;
  pollingStationCode: string | null;
  topic: string | null;
  tags: string[];
  summary: string;
  source: string;
  reportedAtLabel: string;
  authorName: string | null;
  supportLevel: string;
  priority: string;
  status: string;
  sentiment: number | null;
  linkedTaskId: string | null;
  linkedTaskTitle: string | null;
};

export type ActiveUserOption = {
  id: string;
  fullName: string;
  email: string;
};

export type PollingStationOption = {
  code: string;
  label: string;
};

export type CitizenOption = {
  id: string;
  label: string;
};

export type ContactListItem = {
  id: string;
  fullName: string;
  contactKind: string;
  organization: string | null;
  roleLabel: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  tags: string[];
  notes: string | null;
  createdByName: string | null;
  updatedAtLabel: string;
};

export type CitizenListItem = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  neighborhood: string | null;
  pollingStationCode: string | null;
  supportLevel: string;
  tags: string[];
  notes: string | null;
  createdByName: string | null;
  updatedAtLabel: string;
  recentReports: Array<{
    id: string;
    topic: string | null;
    summary: string;
    status: string;
    reportedAtLabel: string;
  }>;
  relatedTasks: Array<{
    id: string;
    title: string;
    status: string;
    dueAtLabel: string | null;
  }>;
};

export type SectorCoverageItem = {
  id: string;
  code: string;
  label: string;
  pollingStationCode: string | null;
  priorityRank: number;
  neighborhood: string | null;
  notes: string | null;
  primaryOwnerId: string | null;
  primaryOwnerName: string | null;
  reportCount: number;
  urgentReportCount: number;
  citizenCount: number;
  turnoutPct: number | null;
  topCandidateLabel: string | null;
  topCandidateShare: number | null;
  priorityScore: number;
};

export type TeamCoverageData = {
  sectors: SectorCoverageItem[];
  uncoveredCount: number;
  coveredCount: number;
  urgentSectorCount: number;
  priorityLeaders: SectorCoverageItem[];
  actionBuckets: {
    assignThisWeek: SectorCoverageItem[];
    reviewPolitically: SectorCoverageItem[];
    activateField: SectorCoverageItem[];
  };
};

export type SearchResultsData = {
  query: string;
  citizens: Array<{
    id: string;
    fullName: string;
    supportLevel: string;
    pollingStationCode: string | null;
  }>;
  fieldReports: Array<{
    id: string;
    topic: string | null;
    summary: string;
    status: string;
    citizenName: string | null;
    pollingStationCode: string | null;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    ownerName: string | null;
  }>;
};

export type CitizensFilters = {
  q?: string;
  supportLevel?: string;
  pollingStationCode?: string;
};

export type FieldReportsFilters = {
  q?: string;
  supportLevel?: string;
  status?: string;
  pollingStationCode?: string;
};

export type InseePageData = {
  headline: Array<{
    label: string;
    value: string;
    summary: string;
  }>;
  ageBreakdown: Array<{
    label: string;
    count: string;
    share: string;
  }>;
  housingHighlights: Array<{
    label: string;
    value: string;
  }>;
};

export type ElectoralAnalysisData = {
  communeSummary: {
    validatedBureaus: number;
    totalValidatedVotes: number;
    topCandidate: string | null;
    topCandidateVotes: number | null;
  };
  candidateScores: Array<{
    candidateLabel: string;
    candidateGroup: string | null;
    votes: number;
    share: number;
  }>;
  bureauBreakdown: Array<{
    pollingStationCode: string;
    placeName: string;
    turnoutPct: number | null;
    exprimes: number;
    topCandidateLabel: string | null;
    topCandidateVotes: number | null;
    topCandidateShare: number | null;
  }>;
  fieldOverlay: Array<{
    pollingStationCode: string;
    placeName: string;
    turnoutPct: number | null;
    topCandidateLabel: string | null;
    topCandidateShare: number | null;
    reportCount: number;
    urgentCount: number;
    opposedOrSkepticalCount: number;
  }>;
};

export type FieldAnalysisData = {
  summary: {
    totalReports: number;
    openReports: number;
    urgentReports: number;
    linkedCitizens: number;
  };
  topicBreakdown: Array<{
    topic: string;
    reportCount: number;
  }>;
  supportBreakdown: Array<{
    supportLevel: string;
    reportCount: number;
  }>;
  stationBreakdown: Array<{
    pollingStationCode: string;
    placeName: string | null;
    reportCount: number;
    urgentCount: number;
  }>;
  urgentReports: Array<{
    id: string;
    topic: string | null;
    summary: string;
    pollingStationCode: string | null;
    supportLevel: string;
    status: string;
    reportedAtLabel: string;
  }>;
};

export async function getPollingStations(): Promise<PollingStationRecord[]> {
  const db = getPool();
  const { rows } = await db.query<PollingStationRecord>(`
    with bv_summary as (
      select
        polling_station_code,
        max(inscrits) as inscrits_2026,
        max(votants) as votants_2026,
        max(exprimes) as exprimes_2026
      from import_campaign.election_results_bv
      where commune_code = '66028'
        and election_type = 'municipales'
        and election_year = 2026
        and round_number = 1
      group by polling_station_code
    ),
    bv_ranked as (
      select
        polling_station_code,
        candidate_label,
        candidate_group,
        votes,
        row_number() over (
          partition by polling_station_code
          order by votes desc, candidate_label asc
        ) as vote_rank
      from import_campaign.election_results_bv
      where commune_code = '66028'
        and election_type = 'municipales'
        and election_year = 2026
        and round_number = 1
    )
    select
      ps.polling_station_code as "pollingStationCode",
      ps.polling_station_number as "pollingStationNumber",
      ps.place_name as "placeName",
      ps.address as "address",
      ps.is_centralizer as "isCentralizer",
      ps.geometry_type as "geometryType",
      (summary.polling_station_code is not null) as "hasValidatedResults",
      summary.inscrits_2026 as "inscrits2026",
      summary.votants_2026 as "votants2026",
      summary.exprimes_2026 as "exprimes2026",
      ranked.candidate_label as "topCandidateLabel",
      ranked.candidate_group as "topCandidateGroup",
      ranked.votes as "topCandidateVotes"
    from import_campaign.polling_stations_cabestany ps
    left join bv_summary summary
      on summary.polling_station_code = ps.polling_station_code
    left join bv_ranked ranked
      on ranked.polling_station_code = ps.polling_station_code
     and ranked.vote_rank = 1
    where ps.commune_code = '66028'
    order by ps.polling_station_number asc
  `);

  return rows;
}

export async function getDashboardData(): Promise<DashboardData> {
  const db = getPool();
  const [
    hasSectorsTable,
    hasSectorAssignmentsTable,
    hasFieldReportStatus,
    hasFieldReportPriority,
    hasUsersTable,
    hasTeamMembersTable,
    hasMemberAvailabilitiesTable,
  ] = await Promise.all([
    relationExists(db, "public.sectors"),
    relationExists(db, "public.sector_assignments"),
    columnExists(db, "field_reports", "status"),
    columnExists(db, "field_reports", "priority"),
    relationExists(db, "public.users"),
    relationExists(db, "public.team_members"),
    relationExists(db, "public.member_availabilities"),
  ]);
  const hasSectorCoverage = hasSectorsTable && hasSectorAssignmentsTable;
  const openReportsWhere = hasFieldReportStatus ? "where status <> 'closed'" : "";
  const urgentReportsWhere =
    hasFieldReportStatus && hasFieldReportPriority
      ? "where status <> 'closed' and priority in ('high', 'critical')"
      : hasFieldReportPriority
        ? "where priority in ('high', 'critical')"
        : "";
  const urgentCountSql =
    hasFieldReportStatus && hasFieldReportPriority
      ? "count(*) filter (where priority in ('high', 'critical') and status <> 'closed')::int as urgent_count"
      : hasFieldReportPriority
        ? "count(*) filter (where priority in ('high', 'critical'))::int as urgent_count"
        : "0::int as urgent_count";

  const [
    openReportsResult,
    openTasksResult,
    upcomingMeetingsCountResult,
    uncoveredSectorsResult,
    activeUsersResult,
    teamMembersResult,
    primaryOwnersResult,
    upcomingAvailabilitiesResult,
    priorityResult,
    sectorAlertsResult,
    upcomingMeetingsResult,
    recentActivityResult,
  ] =
    await Promise.all([
      db.query<{ count: string }>(`
        select count(*)::text as count
        from field_reports
        ${openReportsWhere}
      `),
      db.query<{ count: string }>(`
        select count(*)::text as count
        from tasks
        where status <> 'done'
          and status <> 'cancelled'
      `),
      db.query<{ count: string }>(`
        select count(*)::text as count
        from meetings
        where starts_at >= now()
          and starts_at < now() + interval '7 days'
          and status <> 'cancelled'
      `),
      hasSectorCoverage
        ? db.query<{ count: string }>(`
            select count(*)::text as count
            from sectors s
            left join sector_assignments sa
              on sa.sector_id = s.id
             and sa.is_primary = true
            where sa.id is null
          `)
        : Promise.resolve({ rows: [{ count: "0" }] }),
      hasUsersTable
        ? db.query<{ count: string }>(`
            select count(*)::text as count
            from users
            where is_active = true
          `)
        : Promise.resolve({ rows: [{ count: "0" }] }),
      hasTeamMembersTable
        ? db.query<{ count: string }>(`
            select count(*)::text as count
            from team_members
          `)
        : Promise.resolve({ rows: [{ count: "0" }] }),
      hasSectorCoverage
        ? db.query<{ count: string }>(`
            select count(distinct user_id)::text as count
            from sector_assignments
            where is_primary = true
          `)
        : Promise.resolve({ rows: [{ count: "0" }] }),
      hasMemberAvailabilitiesTable
        ? db.query<{ count: string }>(`
            select count(*)::text as count
            from member_availabilities
            where starts_at >= now()
              and starts_at < now() + interval '7 days'
          `)
        : Promise.resolve({ rows: [{ count: "0" }] }),
      db.query<{
        label: string;
        value: string;
        summary: string;
        tone: "default" | "accent" | "pine";
      }>(`
        select *
        from (
          values
            (
              'Retours ouverts',
              (select count(*)::text from field_reports ${openReportsWhere}),
              'Volume actuel de retours terrain encore ouverts ou en traitement.',
              'accent'
            ),
            (
              'Urgences terrain',
              (
                select count(*)::text
                from field_reports
                ${urgentReportsWhere}
              ),
              'Retours prioritaires qui demandent un traitement ou un arbitrage rapide.',
              'pine'
            ),
            (
              'Tâches critiques',
              (
                select count(*)::text
                from tasks
                where status <> 'done'
                  and status <> 'cancelled'
                  and priority = 'critical'
              ),
              'Exécution sensible encore non close côté équipe.',
              'default'
            )
        ) as operational(label, value, summary, tone)
      `),
      hasSectorCoverage
        ? db.query<{
            sectorLabel: string;
            ownerName: string | null;
            reportCount: string;
            urgentCount: string;
            priorityScore: string;
          }>(`
            with primary_assignments as (
              select
                sa.sector_id,
                u.full_name,
                row_number() over (
                  partition by sa.sector_id
                  order by sa.is_primary desc, sa.created_at asc
                ) as assignment_rank
              from sector_assignments sa
              join users u on u.id = sa.user_id
            ),
            field_rollup as (
              select
                polling_station_code,
                count(*)::int as report_count,
                ${urgentCountSql}
              from field_reports
              where polling_station_code is not null
              group by polling_station_code
            ),
            election_rollup as (
              with station_totals as (
                select
                  er.polling_station_code,
                  max(er.exprimes) as exprimes
                from import_campaign.election_results_bv er
                where er.commune_code = '66028'
                  and er.election_type = 'municipales'
                  and er.election_year = 2026
                  and er.round_number = 1
                group by er.polling_station_code
              ),
              ranked as (
                select
                  er.polling_station_code,
                  er.votes,
                  row_number() over (
                    partition by er.polling_station_code
                    order by er.votes desc, er.candidate_label asc
                  ) as vote_rank
                from import_campaign.election_results_bv er
                where er.commune_code = '66028'
                  and er.election_type = 'municipales'
                  and er.election_year = 2026
                  and er.round_number = 1
              )
              select
                st.polling_station_code,
                round((ranked.votes::numeric / nullif(st.exprimes, 0)) * 100, 2)::numeric as top_share
              from station_totals st
              left join ranked
                on ranked.polling_station_code = st.polling_station_code
               and ranked.vote_rank = 1
            )
            select
              s.label as "sectorLabel",
              pa.full_name as "ownerName",
              coalesce(fr.report_count, 0)::text as "reportCount",
              coalesce(fr.urgent_count, 0)::text as "urgentCount",
              (
                (case when pa.full_name is null then 40 else 0 end) +
                coalesce(fr.urgent_count, 0) * 12 +
                coalesce(fr.report_count, 0) * 4 +
                (case when er.top_share is null then 0 else greatest(0, 50 - er.top_share)::int end)
              )::text as "priorityScore"
            from sectors s
            left join primary_assignments pa
              on pa.sector_id = s.id
             and pa.assignment_rank = 1
            left join field_rollup fr on fr.polling_station_code = s.polling_station_code
            left join election_rollup er on er.polling_station_code = s.polling_station_code
            order by
              (
                (case when pa.full_name is null then 40 else 0 end) +
                coalesce(fr.urgent_count, 0) * 12 +
                coalesce(fr.report_count, 0) * 4 +
                (case when er.top_share is null then 0 else greatest(0, 50 - er.top_share)::int end)
              ) desc,
              s.priority_rank asc
            limit 3
          `)
        : Promise.resolve({ rows: [] }),
      db.query<{
        title: string;
        startsAtLabel: string;
        location: string | null;
      }>(`
        select
          title,
          to_char(starts_at at time zone 'Europe/Paris', 'DD/MM HH24:MI') as "startsAtLabel",
          location
        from meetings
        where starts_at >= now()
          and starts_at < now() + interval '7 days'
          and status <> 'cancelled'
        order by starts_at asc
        limit 4
      `),
      db.query<{
        kind: string;
        title: string;
        summary: string;
        happenedAtLabel: string;
      }>(`
        select *
        from (
          select
            'Retour terrain'::text as kind,
            coalesce(nullif(topic, ''), 'Retour terrain') as title,
            left(summary, 120) as summary,
            to_char(reported_at at time zone 'Europe/Paris', 'DD/MM HH24:MI') as "happenedAtLabel",
            reported_at as sort_at
          from field_reports

          union all

          select
            'Tâche'::text as kind,
            title,
            coalesce(left(description, 120), 'Nouvelle tâche créée') as summary,
            to_char(created_at at time zone 'Europe/Paris', 'DD/MM HH24:MI') as "happenedAtLabel",
            created_at as sort_at
          from tasks

          union all

          select
            'Citoyen'::text as kind,
            full_name as title,
            coalesce(left(notes, 120), 'Nouvelle fiche citoyen ou mise à jour') as summary,
            to_char(updated_at at time zone 'Europe/Paris', 'DD/MM HH24:MI') as "happenedAtLabel",
            updated_at as sort_at
          from citizens
        ) activity
        order by sort_at desc
        limit 6
      `),
    ]);

  return {
    stats: [
      { label: "Retours ouverts", value: openReportsResult.rows[0]?.count ?? "0", tone: "accent" },
      { label: "Tâches ouvertes", value: openTasksResult.rows[0]?.count ?? "0", tone: "pine" },
      { label: "Réunions 7 jours", value: upcomingMeetingsCountResult.rows[0]?.count ?? "0" },
      { label: "Secteurs sans responsable", value: uncoveredSectorsResult.rows[0]?.count ?? "0" },
      { label: "Comptes actifs", value: activeUsersResult.rows[0]?.count ?? "0" },
    ],
    actionItems: [
      {
        label: "Traiter les retours urgents",
        summary: `${priorityResult.rows[1]?.value ?? "0"} urgences terrain à revoir dans les retours habitants.`,
        href: "/field-reports",
        tone: "accent",
      },
      {
        label: "Relancer les tâches ouvertes",
        summary: `${openTasksResult.rows[0]?.count ?? "0"} tâches encore actives dans le suivi opérationnel.`,
        href: "/tasks",
        tone: "pine",
      },
      {
        label: "Couvrir les secteurs vides",
        summary: `${uncoveredSectorsResult.rows[0]?.count ?? "0"} secteurs sans responsable principal pour le moment.`,
        href: "/team",
        tone: "default",
      },
      {
        label: "Préparer les prochaines réunions",
        summary: `${upcomingMeetingsCountResult.rows[0]?.count ?? "0"} réunions prévues dans les sept prochains jours.`,
        href: "/meetings",
        tone: "default",
      },
    ],
    priorityHighlights: priorityResult.rows,
    sectorAlerts: sectorAlertsResult.rows.map((row) => ({
      sectorLabel: row.sectorLabel,
      ownerName: row.ownerName,
      reportCount: Number(row.reportCount),
      urgentCount: Number(row.urgentCount),
      priorityScore: Number(row.priorityScore),
    })),
    upcomingMeetings: upcomingMeetingsResult.rows,
    recentActivity: recentActivityResult.rows,
    teamHighlights: [
      {
        label: "Comptes actifs",
        value: activeUsersResult.rows[0]?.count ?? "0",
        summary: "Comptes actuellement actifs dans l’outil pour l’équipe de campagne.",
      },
      {
        label: "Fiches équipe",
        value: teamMembersResult.rows[0]?.count ?? "0",
        summary: "Membres d’équipe saisis dans le module équipe, qu’ils aient ou non un compte.",
      },
      {
        label: "Responsables de secteur",
        value: primaryOwnersResult.rows[0]?.count ?? "0",
        summary: "Personnes actuellement désignées comme responsables principaux d’un secteur.",
      },
      {
        label: "Disponibilités 7 jours",
        value: upcomingAvailabilitiesResult.rows[0]?.count ?? "0",
        summary: "Créneaux de disponibilité enregistrés sur les sept prochains jours.",
      },
    ],
  };
}

export async function getUserAdminData(): Promise<UserAdminData> {
  const db = getPool();

  const [usersResult, orgFunctionsResult, permissionsResult] = await Promise.all([
    db.query<{
      id: string;
      email: string;
      fullName: string;
      role: string;
      isActive: boolean;
      orgFunctionId: string | null;
      orgFunctionLabel: string | null;
      passwordUpdatedAt: string | null;
      directPermissionIds: string[] | null;
      effectivePermissionCodes: string[] | null;
    }>(`
      with direct_permissions as (
        select
          up.user_id,
          array_agg(up.permission_id::text order by up.permission_id::text) as permission_ids
        from user_permissions up
        group by up.user_id
      ),
      effective_permissions as (
        select
          permission_union.user_id,
          array_agg(distinct permission_union.code order by permission_union.code) as permission_codes
        from (
          select
            u.id as user_id,
            p.code
          from users u
          join role_permissions rp on rp.role = u.role
          join permissions p on p.id = rp.permission_id

          union all

          select
            up.user_id,
            p.code
          from user_permissions up
          join permissions p on p.id = up.permission_id
        ) permission_union
        group by permission_union.user_id
      )
      select
        u.id,
        u.email,
        u.full_name as "fullName",
        u.role::text as "role",
        u.is_active as "isActive",
        u.org_function_id as "orgFunctionId",
        of.label as "orgFunctionLabel",
        case
          when u.password_updated_at is null then null
          else to_char(u.password_updated_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI')
        end as "passwordUpdatedAt",
        dp.permission_ids as "directPermissionIds",
        ep.permission_codes as "effectivePermissionCodes"
      from users u
      left join org_functions of on of.id = u.org_function_id
      left join direct_permissions dp on dp.user_id = u.id
      left join effective_permissions ep on ep.user_id = u.id
      order by
        case u.role::text
          when 'superadmin' then 1
          when 'admin' then 2
          when 'direction' then 3
          when 'coordinateur' then 4
          when 'militant' then 5
          else 6
        end,
        lower(u.full_name) asc,
        lower(u.email) asc
    `),
    db.query<{
      id: string;
      code: string;
      label: string;
    }>(`
      select id, code, label
      from org_functions
      order by label asc
    `),
    db.query<{
      id: string;
      code: string;
      label: string;
      module: string;
    }>(`
      select id, code, label, module
      from permissions
      order by module asc, code asc
    `),
  ]);

  return {
    users: usersResult.rows.map((row) => ({
      ...row,
      directPermissionIds: row.directPermissionIds ?? [],
      effectivePermissionCodes: row.effectivePermissionCodes ?? [],
    })),
    orgFunctions: orgFunctionsResult.rows,
    permissions: permissionsResult.rows,
  };
}

export async function getTasksData(): Promise<TaskListItem[]> {
  const db = getPool();
  const hasTaskSourceFieldReportId = await columnExists(
    db,
    "tasks",
    "source_field_report_id",
  );
  const { rows } = await db.query<TaskListItem>(`
    select
      t.id,
      t.title,
      t.description,
      t.status::text as status,
      t.priority::text as priority,
      ${
        hasTaskSourceFieldReportId
          ? "t.source_field_report_id"
          : "null::uuid"
      } as "sourceFieldReportId",
      t.assigned_to as "assignedTo",
      case
        when t.due_at is null then null
        else to_char(t.due_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI')
      end as "dueAtLabel",
      owner.full_name as "ownerName",
      ${hasTaskSourceFieldReportId ? "fr.topic" : "null::text"} as "sourceFieldReportTopic"
    from tasks t
    left join users owner on owner.id = t.assigned_to
    ${
      hasTaskSourceFieldReportId
        ? "left join field_reports fr on fr.id = t.source_field_report_id"
        : ""
    }
    order by
      case t.priority
        when 'critical' then 1
        when 'high' then 2
        when 'medium' then 3
        else 4
      end,
      t.due_at asc nulls last,
      t.created_at desc
  `);

  return rows;
}

export async function getMeetingsData(): Promise<MeetingListItem[]> {
  const db = getPool();
  const { rows } = await db.query<{
    id: string;
    title: string;
    description: string | null;
    startsAtLabel: string;
    location: string | null;
    status: string;
    createdByName: string | null;
    notesCount: number;
    openActionsCount: number;
    notes: Array<{
      id: string;
      body: string;
      authorName: string | null;
      createdAtLabel: string;
    }> | null;
    actions: Array<{
      id: string;
      title: string;
      ownerName: string | null;
      dueAtLabel: string | null;
      isDone: boolean;
    }> | null;
  }>(`
    select
      m.id,
      m.title,
      m.description,
      to_char(m.starts_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI') as "startsAtLabel",
      m.location,
      m.status::text as status,
      creator.full_name as "createdByName",
      count(distinct mn.id)::int as "notesCount",
      count(distinct ma.id) filter (where ma.is_done = false)::int as "openActionsCount",
      coalesce(
        jsonb_agg(
          distinct jsonb_build_object(
            'id', mn.id,
            'body', mn.body,
            'authorName', note_author.full_name,
            'createdAtLabel', to_char(mn.created_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI')
          )
        ) filter (where mn.id is not null),
        '[]'::jsonb
      ) as notes,
      coalesce(
        jsonb_agg(
          distinct jsonb_build_object(
            'id', ma.id,
            'title', ma.title,
            'ownerName', action_owner.full_name,
            'dueAtLabel', case
              when ma.due_at is null then null
              else to_char(ma.due_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI')
            end,
            'isDone', ma.is_done
          )
        ) filter (where ma.id is not null),
        '[]'::jsonb
      ) as actions
    from meetings m
    left join users creator on creator.id = m.created_by
    left join meeting_notes mn on mn.meeting_id = m.id
    left join users note_author on note_author.id = mn.author_id
    left join meeting_actions ma on ma.meeting_id = m.id
    left join users action_owner on action_owner.id = ma.owner_id
    group by m.id, creator.full_name
    order by m.starts_at desc
  `);

  return rows.map((row) => ({
    ...row,
    notes: row.notes ?? [],
    actions: row.actions ?? [],
  }));
}

export async function getFieldReportsData(
  filters: FieldReportsFilters = {},
): Promise<FieldReportListItem[]> {
  const db = getPool();
  const q = filters.q?.trim() ?? "";
  const supportLevel = filters.supportLevel?.trim() ?? "";
  const status = filters.status?.trim() ?? "";
  const pollingStationCode = filters.pollingStationCode?.trim() ?? "";
  const [
    hasFieldReportSupportLevel,
    hasFieldReportPriority,
    hasFieldReportStatus,
    hasFieldReportSentiment,
    hasFieldReportTags,
    hasFieldReportPollingStationCode,
    hasTaskSourceFieldReportId,
  ] = await Promise.all([
    columnExists(db, "field_reports", "support_level"),
    columnExists(db, "field_reports", "priority"),
    columnExists(db, "field_reports", "status"),
    columnExists(db, "field_reports", "sentiment"),
    columnExists(db, "field_reports", "tags"),
    columnExists(db, "field_reports", "polling_station_code"),
    columnExists(db, "tasks", "source_field_report_id"),
  ]);
  const { rows } = await db.query<{
    id: string;
    citizenId: string | null;
    citizenName: string | null;
    neighborhood: string | null;
    pollingStationCode: string | null;
    topic: string | null;
    tags: string[] | null;
    summary: string;
    source: string;
    reportedAtLabel: string;
    authorName: string | null;
    supportLevel: string;
    priority: string;
    status: string;
    sentiment: number | null;
    linkedTaskId: string | null;
    linkedTaskTitle: string | null;
  }>(`
    with linked_tasks as (
      ${
        hasTaskSourceFieldReportId
          ? `
      select distinct on (source_field_report_id)
        source_field_report_id,
        id,
        title
      from tasks
      where source_field_report_id is not null
      order by source_field_report_id, created_at desc
      `
          : `
      select
        null::uuid as source_field_report_id,
        null::uuid as id,
        null::text as title
      where false
      `
      }
    )
    select
      fr.id,
      fr.citizen_id as "citizenId",
      citizen.full_name as "citizenName",
      fr.neighborhood,
      ${
        hasFieldReportPollingStationCode
          ? "fr.polling_station_code"
          : "null::text"
      } as "pollingStationCode",
      fr.topic,
      ${hasFieldReportTags ? "fr.tags" : "'{}'::text[]"} as tags,
      fr.summary,
      fr.source,
      ${hasFieldReportSupportLevel ? "fr.support_level::text" : "'unknown'::text"} as "supportLevel",
      ${hasFieldReportPriority ? "fr.priority::text" : "'medium'::text"} as "priority",
      ${hasFieldReportStatus ? "fr.status::text" : "'new'::text"} as "status",
      ${hasFieldReportSentiment ? "fr.sentiment" : "null::integer"} as sentiment,
      lt.id as "linkedTaskId",
      lt.title as "linkedTaskTitle",
      to_char(fr.reported_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI') as "reportedAtLabel",
      author.full_name as "authorName"
    from field_reports fr
    left join users author on author.id = fr.author_id
    left join citizens citizen on citizen.id = fr.citizen_id
    left join linked_tasks lt on lt.source_field_report_id = fr.id
    where (
      $1 = ''
      or fr.summary ilike '%' || $1 || '%'
      or coalesce(fr.topic, '') ilike '%' || $1 || '%'
      or coalesce(fr.neighborhood, '') ilike '%' || $1 || '%'
      or coalesce(citizen.full_name, '') ilike '%' || $1 || '%'
    )
      ${
        hasFieldReportSupportLevel
          ? "and ($2 = '' or fr.support_level::text = $2)"
          : ""
      }
      ${
        hasFieldReportStatus
          ? "and ($3 = '' or fr.status::text = $3)"
          : ""
      }
      ${
        hasFieldReportPollingStationCode
          ? "and ($4 = '' or fr.polling_station_code = $4)"
          : ""
      }
    order by fr.reported_at desc, fr.created_at desc
  `, [q, supportLevel, status, pollingStationCode]);

  return rows.map((row) => ({
    ...row,
    tags: row.tags ?? [],
  }));
}

export async function getActiveUsers(): Promise<ActiveUserOption[]> {
  const db = getPool();
  const { rows } = await db.query<ActiveUserOption>(`
    select
      id,
      full_name as "fullName",
      email
    from users
    where is_active = true
    order by lower(full_name) asc, lower(email) asc
  `);

  return rows;
}

export async function getPollingStationOptions(): Promise<PollingStationOption[]> {
  const db = getPool();
  const { rows } = await db.query<PollingStationOption>(`
    select
      polling_station_code as code,
      concat('Bureau ', polling_station_code, ' · ', place_name) as label
    from import_campaign.polling_stations_cabestany
    where commune_code = '66028'
    order by polling_station_number asc
  `);

  return rows;
}

export async function getCitizenOptions(): Promise<CitizenOption[]> {
  const db = getPool();
  const { rows } = await db.query<CitizenOption>(`
    select
      id,
      case
        when polling_station_code is not null and polling_station_code <> '' then
          concat(full_name, ' · Bureau ', polling_station_code)
        else full_name
      end as label
    from citizens
    order by lower(full_name) asc
  `);

  return rows;
}

export async function getCitizensData(
  filters: CitizensFilters = {},
): Promise<CitizenListItem[]> {
  const db = getPool();
  const q = filters.q?.trim() ?? "";
  const supportLevel = filters.supportLevel?.trim() ?? "";
  const pollingStationCode = filters.pollingStationCode?.trim() ?? "";
  const [hasFieldReportStatus, hasTaskSourceFieldReportId] = await Promise.all([
    columnExists(db, "field_reports", "status"),
    columnExists(db, "tasks", "source_field_report_id"),
  ]);
  const { rows } = await db.query<{
    id: string;
    fullName: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    neighborhood: string | null;
    pollingStationCode: string | null;
    supportLevel: string;
    tags: string[] | null;
    notes: string | null;
    createdByName: string | null;
    updatedAtLabel: string;
    recentReports: Array<{
      id: string;
      topic: string | null;
      summary: string;
      status: string;
      reportedAtLabel: string;
    }> | null;
    relatedTasks: Array<{
      id: string;
      title: string;
      status: string;
      dueAtLabel: string | null;
    }> | null;
  }>(`
    with report_rollup as (
      select
        fr.citizen_id,
        jsonb_agg(
          jsonb_build_object(
            'id', fr.id,
            'topic', fr.topic,
            'summary', fr.summary,
            'status', ${hasFieldReportStatus ? "fr.status::text" : "'new'::text"},
            'reportedAtLabel', to_char(fr.reported_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI')
          )
          order by fr.reported_at desc, fr.created_at desc
        ) as reports
      from (
        select
          field_reports.*,
          row_number() over (
            partition by field_reports.citizen_id
            order by field_reports.reported_at desc, field_reports.created_at desc
          ) as report_rank
        from field_reports
        where field_reports.citizen_id is not null
      ) fr
      where fr.report_rank <= 5
      group by fr.citizen_id
    ),
    task_rollup as (
      ${
        hasTaskSourceFieldReportId
          ? `
      select
        task_source.citizen_id,
        jsonb_agg(
          jsonb_build_object(
            'id', task_source.id,
            'title', task_source.title,
            'status', task_source.status::text,
            'dueAtLabel', case
              when task_source.due_at is null then null
              else to_char(task_source.due_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI')
            end
          )
          order by task_source.created_at desc
        ) as tasks
      from (
        select
          t.*,
          fr.citizen_id,
          row_number() over (
            partition by fr.citizen_id
            order by t.created_at desc
          ) as task_rank
        from tasks t
        join field_reports fr on fr.id = t.source_field_report_id
        where fr.citizen_id is not null
      ) task_source
      where task_source.task_rank <= 5
      group by task_source.citizen_id
      `
          : `
      select
        null::uuid as citizen_id,
        '[]'::jsonb as tasks
      where false
      `
      }
    )
    select
      c.id,
      c.full_name as "fullName",
      c.phone,
      c.email,
      c.address,
      c.neighborhood,
      c.polling_station_code as "pollingStationCode",
      c.support_level::text as "supportLevel",
      c.tags,
      c.notes,
      creator.full_name as "createdByName",
      to_char(c.updated_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI') as "updatedAtLabel",
      rr.reports as "recentReports",
      tr.tasks as "relatedTasks"
    from citizens c
    left join users creator on creator.id = c.created_by
    left join report_rollup rr on rr.citizen_id = c.id
    left join task_rollup tr on tr.citizen_id = c.id
    where (
      $1 = ''
      or c.full_name ilike '%' || $1 || '%'
      or coalesce(c.email, '') ilike '%' || $1 || '%'
      or coalesce(c.phone, '') ilike '%' || $1 || '%'
      or coalesce(c.address, '') ilike '%' || $1 || '%'
      or coalesce(c.neighborhood, '') ilike '%' || $1 || '%'
    )
      and ($2 = '' or c.support_level::text = $2)
      and ($3 = '' or c.polling_station_code = $3)
    order by lower(c.full_name) asc, c.updated_at desc
  `, [q, supportLevel, pollingStationCode]);

  return rows.map((row) => ({
    ...row,
    tags: row.tags ?? [],
    recentReports: row.recentReports ?? [],
    relatedTasks: row.relatedTasks ?? [],
  }));
}

export async function getContactsData({
  q = "",
  contactKind = "",
}: {
  q?: string;
  contactKind?: string;
}): Promise<ContactListItem[]> {
  const db = getPool();
  const hasContactsTable = await relationExists(db, "public.contacts");

  if (!hasContactsTable) {
    return [];
  }

  const { rows } = await db.query<{
    id: string;
    fullName: string;
    contactKind: string;
    organization: string | null;
    roleLabel: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    tags: string[] | null;
    notes: string | null;
    createdByName: string | null;
    updatedAtLabel: string;
  }>(`
    select
      c.id,
      c.full_name as "fullName",
      c.contact_kind as "contactKind",
      c.organization,
      c.role_label as "roleLabel",
      c.email,
      c.phone,
      c.location,
      c.tags,
      c.notes,
      creator.full_name as "createdByName",
      to_char(c.updated_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI') as "updatedAtLabel"
    from contacts c
    left join users creator on creator.id = c.created_by
    where (
      $1 = ''
      or c.full_name ilike '%' || $1 || '%'
      or coalesce(c.organization, '') ilike '%' || $1 || '%'
      or coalesce(c.role_label, '') ilike '%' || $1 || '%'
      or coalesce(c.email, '') ilike '%' || $1 || '%'
      or coalesce(c.phone, '') ilike '%' || $1 || '%'
      or coalesce(c.location, '') ilike '%' || $1 || '%'
      or exists (
        select 1
        from unnest(c.tags) as tag
        where tag ilike '%' || $1 || '%'
      )
    )
      and ($2 = '' or c.contact_kind = $2)
    order by lower(c.full_name) asc, c.updated_at desc
  `, [q, contactKind]);

  return rows.map((row) => ({
    ...row,
    tags: row.tags ?? [],
  }));
}

export async function getInseePageData(): Promise<InseePageData> {
  const db = getPool();

  const [headlineResult, ageResult, housingResult] = await Promise.all([
    db.query<{
      label: string;
      value: string | null;
      summary: string;
    }>(`
      select *
      from (
        values
          (
            'Population 2022',
            (
              select value_numeric::text
              from import_campaign.insee_indicators
              where commune_code = '66028'
                and table_code = 'POP_T0'
                and row_label = 'Ensemble'
                and year = 2022
                and column_label = '2022'
              limit 1
            ),
            'Population municipale totale issue du tableau POP_T0.'
          ),
          (
            'Inscrits municipales 2026',
            (
              select value_numeric::text
              from import_campaign.insee_indicators
              where commune_code = '66028'
                and table_code = 'REU'
                and row_label ilike '%Municipales 2026%'
              order by column_index asc
              limit 1
            ),
            'Référence REU utile pour comparer terrain, participation et cible électorale.'
          ),
          (
            '65 ans ou plus',
            (
              select round(sum(value_numeric))::text
              from import_campaign.insee_indicators
              where commune_code = '66028'
                and table_code = 'POP_T0'
                and year = 2022
                and row_label in ('60 à 74 ans', '75 ans ou plus')
                and column_label = '2022'
            ),
            'Volume utile pour calibrer messages, services et présence de proximité.'
          )
      ) as headline(label, value, summary)
    `),
    db.query<{
      label: string;
      count: string | null;
      share: string | null;
    }>(`
      with age_counts as (
        select
          row_label,
          max(case when column_label = '2022' then value_numeric end) as count_2022,
          max(case when unit = 'percent' then value_numeric end) as share_2022
        from import_campaign.insee_indicators
        where commune_code = '66028'
          and table_code = 'POP_T0'
          and year = 2022
          and row_label <> 'Ensemble'
        group by row_label
      )
      select
        row_label as label,
        count_2022::text as count,
        share_2022::text as share
      from age_counts
      order by
        case row_label
          when '0 à 14 ans' then 1
          when '15 à 29 ans' then 2
          when '30 à 44 ans' then 3
          when '45 à 59 ans' then 4
          when '60 à 74 ans' then 5
          else 6
        end
    `),
    db.query<{
      label: string;
      value: string | null;
    }>(`
      select *
      from (
        values
          (
            'Ménages',
            (
              select value_numeric::text
              from import_campaign.insee_indicators
              where commune_code = '66028'
                and table_code = 'MEN_T1'
                and row_label = 'Ensemble'
                and year = 2022
                and column_label = '2022'
              limit 1
            )
          ),
          (
            'Résidences principales',
            (
              select value_numeric::text
              from import_campaign.insee_indicators
              where commune_code = '66028'
                and table_code = 'LOG_T1'
                and row_label = 'Résidences principales'
                and year = 2022
                and column_label = '2022'
              limit 1
            )
          ),
          (
            'Maisons',
            (
              select value_numeric::text
              from import_campaign.insee_indicators
              where commune_code = '66028'
                and table_code = 'LOG_T2'
                and row_label = 'Maisons'
                and unit = 'percent'
                and column_label = '%'
              order by year desc nulls last, column_index asc
              limit 1
            )
          )
      ) as housing(label, value)
    `),
  ]);

  return {
    headline: headlineResult.rows.map((row) => ({
      label: row.label,
      value: formatInteger(row.value),
      summary: row.summary,
    })),
    ageBreakdown: ageResult.rows.map((row) => ({
      label: row.label,
      count: formatInteger(row.count),
      share:
        row.share === null
          ? "N/A"
          : `${new Intl.NumberFormat("fr-FR", {
              maximumFractionDigits: 1,
              minimumFractionDigits: 1,
            }).format(Number(row.share))} %`,
    })),
    housingHighlights: housingResult.rows.map((row) => ({
      label: row.label,
      value: formatInteger(row.value),
    })),
  };
}

export async function getElectoralAnalysisData(): Promise<ElectoralAnalysisData> {
  const db = getPool();
  const [
    hasFieldReportPollingStationCode,
    hasFieldReportPriority,
    hasFieldReportSupportLevel,
  ] = await Promise.all([
    columnExists(db, "field_reports", "polling_station_code"),
    columnExists(db, "field_reports", "priority"),
    columnExists(db, "field_reports", "support_level"),
  ]);

  const [summaryResult, candidateResult, bureauResult, fieldOverlayResult] = await Promise.all([
    db.query<{
      validatedBureaus: string;
      totalValidatedVotes: string;
      topCandidate: string | null;
      topCandidateVotes: string | null;
    }>(`
      with candidate_totals as (
        select
          candidate_label,
          sum(votes) as total_votes
        from import_campaign.election_results_bv
        where commune_code = '66028'
          and election_type = 'municipales'
          and election_year = 2026
          and round_number = 1
        group by candidate_label
      )
      select
        count(distinct polling_station_code)::text as "validatedBureaus",
        coalesce(sum(votes), 0)::text as "totalValidatedVotes",
        (
          select candidate_label
          from candidate_totals
          order by total_votes desc, candidate_label asc
          limit 1
        ) as "topCandidate",
        (
          select total_votes::text
          from candidate_totals
          order by total_votes desc, candidate_label asc
          limit 1
        ) as "topCandidateVotes"
      from import_campaign.election_results_bv
      where commune_code = '66028'
        and election_type = 'municipales'
        and election_year = 2026
        and round_number = 1
    `),
    db.query<{
      candidateLabel: string;
      candidateGroup: string | null;
      votes: number;
      share: string;
    }>(`
      with totals as (
        select sum(votes)::numeric as total_votes
        from import_campaign.election_results_bv
        where commune_code = '66028'
          and election_type = 'municipales'
          and election_year = 2026
          and round_number = 1
      )
      select
        candidate_label as "candidateLabel",
        max(candidate_group) as "candidateGroup",
        sum(votes)::int as votes,
        round((sum(votes)::numeric / nullif((select total_votes from totals), 0)) * 100, 2)::text as share
      from import_campaign.election_results_bv
      where commune_code = '66028'
        and election_type = 'municipales'
        and election_year = 2026
        and round_number = 1
      group by candidate_label
      order by sum(votes) desc, candidate_label asc
    `),
    db.query<{
      pollingStationCode: string;
      placeName: string;
      turnoutPct: string | null;
      exprimes: number;
      topCandidateLabel: string | null;
      topCandidateVotes: number | null;
      topCandidateShare: string | null;
    }>(`
      with station_totals as (
        select
          er.polling_station_code,
          max(er.inscrits) as inscrits,
          max(er.votants) as votants,
          max(er.exprimes) as exprimes
        from import_campaign.election_results_bv er
        where er.commune_code = '66028'
          and er.election_type = 'municipales'
          and er.election_year = 2026
          and er.round_number = 1
        group by er.polling_station_code
      ),
      ranked as (
        select
          er.polling_station_code,
          er.candidate_label,
          er.votes,
          row_number() over (
            partition by er.polling_station_code
            order by er.votes desc, er.candidate_label asc
          ) as vote_rank
        from import_campaign.election_results_bv er
        where er.commune_code = '66028'
          and er.election_type = 'municipales'
          and er.election_year = 2026
          and er.round_number = 1
      )
      select
        ps.polling_station_code as "pollingStationCode",
        ps.place_name as "placeName",
        round((st.votants::numeric / nullif(st.inscrits, 0)) * 100, 2)::text as "turnoutPct",
        st.exprimes::int as exprimes,
        ranked.candidate_label as "topCandidateLabel",
        ranked.votes::int as "topCandidateVotes",
        round((ranked.votes::numeric / nullif(st.exprimes, 0)) * 100, 2)::text as "topCandidateShare"
      from station_totals st
      join import_campaign.polling_stations_cabestany ps
        on ps.polling_station_code = st.polling_station_code
      left join ranked
        on ranked.polling_station_code = st.polling_station_code
       and ranked.vote_rank = 1
      order by ps.polling_station_number asc
    `),
    db.query<{
      pollingStationCode: string;
      placeName: string;
      turnoutPct: string | null;
      topCandidateLabel: string | null;
      topCandidateShare: string | null;
      reportCount: string;
      urgentCount: string;
      opposedOrSkepticalCount: string;
    }>(`
      with station_totals as (
        select
          er.polling_station_code,
          max(er.inscrits) as inscrits,
          max(er.votants) as votants,
          max(er.exprimes) as exprimes
        from import_campaign.election_results_bv er
        where er.commune_code = '66028'
          and er.election_type = 'municipales'
          and er.election_year = 2026
          and er.round_number = 1
        group by er.polling_station_code
      ),
      ranked as (
        select
          er.polling_station_code,
          er.candidate_label,
          er.votes,
          row_number() over (
            partition by er.polling_station_code
            order by er.votes desc, er.candidate_label asc
          ) as vote_rank
        from import_campaign.election_results_bv er
        where er.commune_code = '66028'
          and er.election_type = 'municipales'
          and er.election_year = 2026
          and er.round_number = 1
      ),
      field_rollup as (
        select
          ${
            hasFieldReportPollingStationCode
              ? "fr.polling_station_code"
              : "null::text"
          },
          count(*)::int as report_count,
          ${
            hasFieldReportPriority
              ? "count(*) filter (where fr.priority in ('high', 'critical'))::int"
              : "0::int"
          } as urgent_count,
          ${
            hasFieldReportSupportLevel
              ? "count(*) filter (where fr.support_level in ('opposed', 'skeptical'))::int"
              : "0::int"
          } as opposed_or_skeptical_count
        from field_reports fr
        ${
          hasFieldReportPollingStationCode
            ? "where fr.polling_station_code is not null group by fr.polling_station_code"
            : "where false group by 1"
        }
      )
      select
        ps.polling_station_code as "pollingStationCode",
        ps.place_name as "placeName",
        round((st.votants::numeric / nullif(st.inscrits, 0)) * 100, 2)::text as "turnoutPct",
        ranked.candidate_label as "topCandidateLabel",
        round((ranked.votes::numeric / nullif(st.exprimes, 0)) * 100, 2)::text as "topCandidateShare",
        coalesce(fr.report_count, 0)::text as "reportCount",
        coalesce(fr.urgent_count, 0)::text as "urgentCount",
        coalesce(fr.opposed_or_skeptical_count, 0)::text as "opposedOrSkepticalCount"
      from import_campaign.polling_stations_cabestany ps
      left join station_totals st on st.polling_station_code = ps.polling_station_code
      left join ranked
        on ranked.polling_station_code = ps.polling_station_code
       and ranked.vote_rank = 1
      left join field_rollup fr on fr.polling_station_code = ps.polling_station_code
      where ps.commune_code = '66028'
      order by ps.polling_station_number asc
    `),
  ]);

  return {
    communeSummary: {
      validatedBureaus: Number(summaryResult.rows[0]?.validatedBureaus ?? "0"),
      totalValidatedVotes: Number(summaryResult.rows[0]?.totalValidatedVotes ?? "0"),
      topCandidate: summaryResult.rows[0]?.topCandidate ?? null,
      topCandidateVotes: summaryResult.rows[0]?.topCandidateVotes
        ? Number(summaryResult.rows[0].topCandidateVotes)
        : null,
    },
    candidateScores: candidateResult.rows.map((row) => ({
      candidateLabel: row.candidateLabel,
      candidateGroup: row.candidateGroup,
      votes: row.votes,
      share: Number(row.share),
    })),
    bureauBreakdown: bureauResult.rows.map((row) => ({
      pollingStationCode: row.pollingStationCode,
      placeName: row.placeName,
      turnoutPct: row.turnoutPct === null ? null : Number(row.turnoutPct),
      exprimes: row.exprimes,
      topCandidateLabel: row.topCandidateLabel,
      topCandidateVotes: row.topCandidateVotes,
      topCandidateShare:
        row.topCandidateShare === null ? null : Number(row.topCandidateShare),
    })),
    fieldOverlay: fieldOverlayResult.rows.map((row) => ({
      pollingStationCode: row.pollingStationCode,
      placeName: row.placeName,
      turnoutPct: row.turnoutPct === null ? null : Number(row.turnoutPct),
      topCandidateLabel: row.topCandidateLabel,
      topCandidateShare:
        row.topCandidateShare === null ? null : Number(row.topCandidateShare),
      reportCount: Number(row.reportCount),
      urgentCount: Number(row.urgentCount),
      opposedOrSkepticalCount: Number(row.opposedOrSkepticalCount),
    })),
  };
}

export async function getFieldAnalysisData(): Promise<FieldAnalysisData> {
  const db = getPool();
  const [
    hasFieldReportStatus,
    hasFieldReportPriority,
    hasFieldReportSupportLevel,
    hasFieldReportPollingStationCode,
  ] =
    await Promise.all([
      columnExists(db, "field_reports", "status"),
      columnExists(db, "field_reports", "priority"),
      columnExists(db, "field_reports", "support_level"),
      columnExists(db, "field_reports", "polling_station_code"),
    ]);

  const [summaryResult, topicResult, supportResult, stationResult, urgentResult] =
    await Promise.all([
      db.query<{
        totalReports: string;
        openReports: string;
        urgentReports: string;
        linkedCitizens: string;
      }>(`
        select
          count(*)::text as "totalReports",
          ${
            hasFieldReportStatus
              ? "count(*) filter (where status <> 'closed')::text"
              : "count(*)::text"
          } as "openReports",
          ${
            hasFieldReportPriority
              ? "count(*) filter (where priority in ('high', 'critical'))::text"
              : "'0'::text"
          } as "urgentReports",
          count(*) filter (where citizen_id is not null)::text as "linkedCitizens"
        from field_reports
      `),
      db.query<{
        topic: string;
        reportCount: string;
      }>(`
        select
          coalesce(nullif(trim(topic), ''), 'Sans sujet') as topic,
          count(*)::text as "reportCount"
        from field_reports
        group by 1
        order by count(*) desc, topic asc
        limit 8
      `),
      db.query<{
        supportLevel: string;
        reportCount: string;
      }>(`
        select
          ${
            hasFieldReportSupportLevel
              ? "support_level::text"
              : "'unknown'::text"
          } as "supportLevel",
          count(*)::text as "reportCount"
        from field_reports
        ${
          hasFieldReportSupportLevel
            ? "group by support_level order by count(*) desc, support_level asc"
            : "group by 1 order by count(*) desc, 1 asc"
        }
      `),
      db.query<{
        pollingStationCode: string;
        placeName: string | null;
        reportCount: string;
        urgentCount: string;
      }>(`
        select
          ${
            hasFieldReportPollingStationCode
              ? "coalesce(fr.polling_station_code, 'Non rattaché')"
              : "'Non rattaché'"
          } as "pollingStationCode",
          ps.place_name as "placeName",
          count(*)::text as "reportCount",
          ${
            hasFieldReportPriority
              ? "count(*) filter (where fr.priority in ('high', 'critical'))::text"
              : "'0'::text"
          } as "urgentCount"
        from field_reports fr
        left join import_campaign.polling_stations_cabestany ps
          on ps.polling_station_code = ${
            hasFieldReportPollingStationCode ? "fr.polling_station_code" : "null"
          }
         and ps.commune_code = '66028'
        group by 1, 2
        order by count(*) desc, 1 asc
      `),
      db.query<{
        id: string;
        topic: string | null;
        summary: string;
        pollingStationCode: string | null;
        supportLevel: string;
        status: string;
        reportedAtLabel: string;
      }>(`
        select
          fr.id,
          fr.topic,
          fr.summary,
          ${
            hasFieldReportPollingStationCode
              ? "fr.polling_station_code"
              : "null::text"
          } as "pollingStationCode",
          ${
            hasFieldReportSupportLevel
              ? "fr.support_level::text"
              : "'unknown'::text"
          } as "supportLevel",
          ${hasFieldReportStatus ? "fr.status::text" : "'new'::text"} as "status",
          to_char(fr.reported_at at time zone 'Europe/Paris', 'YYYY-MM-DD HH24:MI') as "reportedAtLabel"
        from field_reports fr
        where ${hasFieldReportPriority ? "fr.priority in ('high', 'critical')" : "false"}
          and ${hasFieldReportStatus ? "fr.status <> 'closed'" : "true"}
        order by fr.reported_at desc
        limit 8
      `),
    ]);

  return {
    summary: {
      totalReports: Number(summaryResult.rows[0]?.totalReports ?? "0"),
      openReports: Number(summaryResult.rows[0]?.openReports ?? "0"),
      urgentReports: Number(summaryResult.rows[0]?.urgentReports ?? "0"),
      linkedCitizens: Number(summaryResult.rows[0]?.linkedCitizens ?? "0"),
    },
    topicBreakdown: topicResult.rows.map((row) => ({
      topic: row.topic,
      reportCount: Number(row.reportCount),
    })),
    supportBreakdown: supportResult.rows.map((row) => ({
      supportLevel: row.supportLevel,
      reportCount: Number(row.reportCount),
    })),
    stationBreakdown: stationResult.rows.map((row) => ({
      pollingStationCode: row.pollingStationCode,
      placeName: row.placeName,
      reportCount: Number(row.reportCount),
      urgentCount: Number(row.urgentCount),
    })),
    urgentReports: urgentResult.rows,
  };
}

export async function getTeamCoverageData(): Promise<TeamCoverageData> {
  const db = getPool();
  const [
    hasSectors,
    hasSectorAssignments,
    hasFieldReportPollingStationCode,
    hasFieldReportPriority,
    hasFieldReportStatus,
  ] = await Promise.all([
    relationExists(db, "public.sectors"),
    relationExists(db, "public.sector_assignments"),
    columnExists(db, "field_reports", "polling_station_code"),
    columnExists(db, "field_reports", "priority"),
    columnExists(db, "field_reports", "status"),
  ]);

  if (!hasSectors || !hasSectorAssignments) {
    return {
      sectors: [],
      coveredCount: 0,
      uncoveredCount: 0,
      urgentSectorCount: 0,
      priorityLeaders: [],
      actionBuckets: {
        assignThisWeek: [],
        reviewPolitically: [],
        activateField: [],
      },
    };
  }

  const { rows } = await db.query<{
    id: string;
    code: string;
    label: string;
    pollingStationCode: string | null;
    priorityRank: number;
    neighborhood: string | null;
    notes: string | null;
    primaryOwnerId: string | null;
    primaryOwnerName: string | null;
    reportCount: string;
    urgentReportCount: string;
    citizenCount: string;
    turnoutPct: string | null;
    topCandidateLabel: string | null;
    topCandidateShare: string | null;
  }>(`
    with primary_assignments as (
      select
        sa.sector_id,
        sa.user_id,
        u.full_name,
        row_number() over (
          partition by sa.sector_id
          order by sa.is_primary desc, sa.created_at asc
        ) as assignment_rank
      from sector_assignments sa
      join users u on u.id = sa.user_id
    ),
    field_rollup as (
      select
        ${
          hasFieldReportPollingStationCode
            ? "polling_station_code"
            : "null::text"
        },
        count(*)::int as report_count,
        ${
          hasFieldReportPriority && hasFieldReportStatus
            ? "count(*) filter (where priority in ('high', 'critical') and status <> 'closed')::int"
            : hasFieldReportPriority
              ? "count(*) filter (where priority in ('high', 'critical'))::int"
              : "0::int"
        } as urgent_report_count
      from field_reports
      ${
        hasFieldReportPollingStationCode
          ? "where polling_station_code is not null group by polling_station_code"
          : "where false group by 1"
      }
    ),
    citizen_rollup as (
      select
        polling_station_code,
        count(*)::int as citizen_count
      from citizens
      where polling_station_code is not null
      group by polling_station_code
    ),
    election_rollup as (
      with station_totals as (
        select
          er.polling_station_code,
          max(er.inscrits) as inscrits,
          max(er.votants) as votants,
          max(er.exprimes) as exprimes
        from import_campaign.election_results_bv er
        where er.commune_code = '66028'
          and er.election_type = 'municipales'
          and er.election_year = 2026
          and er.round_number = 1
        group by er.polling_station_code
      ),
      ranked as (
        select
          er.polling_station_code,
          er.candidate_label,
          er.votes,
          row_number() over (
            partition by er.polling_station_code
            order by er.votes desc, er.candidate_label asc
          ) as vote_rank
        from import_campaign.election_results_bv er
        where er.commune_code = '66028'
          and er.election_type = 'municipales'
          and er.election_year = 2026
          and er.round_number = 1
      )
      select
        st.polling_station_code,
        round((st.votants::numeric / nullif(st.inscrits, 0)) * 100, 2)::text as turnout_pct,
        ranked.candidate_label as top_candidate_label,
        round((ranked.votes::numeric / nullif(st.exprimes, 0)) * 100, 2)::text as top_candidate_share
      from station_totals st
      left join ranked
        on ranked.polling_station_code = st.polling_station_code
       and ranked.vote_rank = 1
    )
    select
      s.id,
      s.code,
      s.label,
      s.polling_station_code as "pollingStationCode",
      s.priority_rank as "priorityRank",
      s.neighborhood,
      s.notes,
      pa.user_id as "primaryOwnerId",
      pa.full_name as "primaryOwnerName",
      coalesce(fr.report_count, 0)::text as "reportCount",
      coalesce(fr.urgent_report_count, 0)::text as "urgentReportCount",
      coalesce(cr.citizen_count, 0)::text as "citizenCount",
      er.turnout_pct as "turnoutPct",
      er.top_candidate_label as "topCandidateLabel",
      er.top_candidate_share as "topCandidateShare"
    from sectors s
    left join primary_assignments pa
      on pa.sector_id = s.id
     and pa.assignment_rank = 1
    left join field_rollup fr on fr.polling_station_code = s.polling_station_code
    left join citizen_rollup cr on cr.polling_station_code = s.polling_station_code
    left join election_rollup er on er.polling_station_code = s.polling_station_code
    order by s.priority_rank asc, s.label asc
  `);

  const sectors = rows.map((row) => ({
    ...row,
    reportCount: Number(row.reportCount),
    urgentReportCount: Number(row.urgentReportCount),
    citizenCount: Number(row.citizenCount),
    turnoutPct: row.turnoutPct === null ? null : Number(row.turnoutPct),
    topCandidateShare: row.topCandidateShare === null ? null : Number(row.topCandidateShare),
    priorityScore:
      (row.primaryOwnerId ? 0 : 40) +
      Number(row.urgentReportCount) * 12 +
      Number(row.reportCount) * 4 +
      (row.topCandidateShare === null ? 0 : Math.max(0, 50 - Number(row.topCandidateShare))),
  }));

  const priorityLeaders = [...sectors]
    .sort((left, right) => right.priorityScore - left.priorityScore || left.priorityRank - right.priorityRank)
    .slice(0, 5);

  const assignThisWeek = sectors
    .filter((sector) => !sector.primaryOwnerId)
    .sort((left, right) => right.priorityScore - left.priorityScore || left.priorityRank - right.priorityRank)
    .slice(0, 5);

  const reviewPolitically = sectors
    .filter(
      (sector) =>
        sector.urgentReportCount > 0 ||
        sector.reportCount > 0 && sector.topCandidateShare !== null && sector.topCandidateShare < 50,
    )
    .sort((left, right) => right.priorityScore - left.priorityScore || left.priorityRank - right.priorityRank)
    .slice(0, 5);

  const activateField = sectors
    .filter((sector) => sector.primaryOwnerId && sector.reportCount > 0)
    .sort((left, right) => right.reportCount - left.reportCount || right.urgentReportCount - left.urgentReportCount)
    .slice(0, 5);

  return {
    sectors,
    uncoveredCount: sectors.filter((sector) => !sector.primaryOwnerId).length,
    coveredCount: sectors.filter((sector) => sector.primaryOwnerId).length,
    urgentSectorCount: sectors.filter((sector) => sector.urgentReportCount > 0).length,
    priorityLeaders,
    actionBuckets: {
      assignThisWeek,
      reviewPolitically,
      activateField,
    },
  };
}

export async function getSearchResults(
  query: string,
  options: {
    canReadCitizens: boolean;
    canReadFieldReports: boolean;
    canReadTasks: boolean;
  },
): Promise<SearchResultsData> {
  const db = getPool();
  const q = query.trim();

  if (!q) {
    return {
      query: "",
      citizens: [],
      fieldReports: [],
      tasks: [],
    };
  }

  const [
    hasCitizenSupportLevel,
    hasCitizenPollingStationCode,
    hasFieldReportStatus,
    hasFieldReportPollingStationCode,
  ] = await Promise.all([
    columnExists(db, "citizens", "support_level"),
    columnExists(db, "citizens", "polling_station_code"),
    columnExists(db, "field_reports", "status"),
    columnExists(db, "field_reports", "polling_station_code"),
  ]);

  const [citizensResult, fieldReportsResult, tasksResult] = await Promise.all([
    options.canReadCitizens
      ? db.query<{
          id: string;
          fullName: string;
          supportLevel: string;
          pollingStationCode: string | null;
        }>(`
          select
            c.id,
            c.full_name as "fullName",
            ${
              hasCitizenSupportLevel
                ? "c.support_level::text"
                : "'unknown'::text"
            } as "supportLevel",
            ${
              hasCitizenPollingStationCode
                ? "c.polling_station_code"
                : "null::text"
            } as "pollingStationCode"
          from citizens c
          where
            c.full_name ilike '%' || $1 || '%'
            or coalesce(c.email, '') ilike '%' || $1 || '%'
            or coalesce(c.phone, '') ilike '%' || $1 || '%'
            or coalesce(c.address, '') ilike '%' || $1 || '%'
            or coalesce(c.neighborhood, '') ilike '%' || $1 || '%'
          order by lower(c.full_name) asc
          limit 8
        `, [q])
      : Promise.resolve({ rows: [] }),
    options.canReadFieldReports
      ? db.query<{
          id: string;
          topic: string | null;
          summary: string;
          status: string;
          citizenName: string | null;
          pollingStationCode: string | null;
        }>(`
          select
            fr.id,
            fr.topic,
            fr.summary,
            ${hasFieldReportStatus ? "fr.status::text" : "'new'::text"} as status,
            citizen.full_name as "citizenName",
            ${
              hasFieldReportPollingStationCode
                ? "fr.polling_station_code"
                : "null::text"
            } as "pollingStationCode"
          from field_reports fr
          left join citizens citizen on citizen.id = fr.citizen_id
          where
            coalesce(fr.topic, '') ilike '%' || $1 || '%'
            or fr.summary ilike '%' || $1 || '%'
            or coalesce(fr.neighborhood, '') ilike '%' || $1 || '%'
            or coalesce(citizen.full_name, '') ilike '%' || $1 || '%'
          order by fr.reported_at desc
          limit 8
        `, [q])
      : Promise.resolve({ rows: [] }),
    options.canReadTasks
      ? db.query<{
          id: string;
          title: string;
          status: string;
          priority: string;
          ownerName: string | null;
        }>(`
          select
            t.id,
            t.title,
            t.status::text as status,
            t.priority::text as priority,
            owner.full_name as "ownerName"
          from tasks t
          left join users owner on owner.id = t.assigned_to
          where
            t.title ilike '%' || $1 || '%'
            or coalesce(t.description, '') ilike '%' || $1 || '%'
          order by t.updated_at desc
          limit 8
        `, [q])
      : Promise.resolve({ rows: [] }),
  ]);

  return {
    query: q,
    citizens: citizensResult.rows,
    fieldReports: fieldReportsResult.rows,
    tasks: tasksResult.rows,
  };
}
