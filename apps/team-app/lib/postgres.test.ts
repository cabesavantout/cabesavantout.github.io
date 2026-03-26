import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const queryMock = vi.fn();
const poolConstructorMock = vi.fn(() => ({
  query: queryMock,
}));

vi.mock("pg", () => ({
  Pool: poolConstructorMock,
}));

describe("postgres helpers", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    queryMock.mockReset();
    poolConstructorMock.mockClear();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("détecte la présence de DATABASE_URL", async () => {
    delete process.env.DATABASE_URL;
    const moduleWithoutDb = await import("@/lib/postgres");
    expect(moduleWithoutDb.hasDatabaseUrl()).toBe(false);

    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    vi.resetModules();
    const moduleWithDb = await import("@/lib/postgres");
    expect(moduleWithDb.hasDatabaseUrl()).toBe(true);
  });

  it("refuse de créer un pool sans DATABASE_URL", async () => {
    delete process.env.DATABASE_URL;
    const module = await import("@/lib/postgres");

    expect(() => module.getPool()).toThrow(
      "Missing environment variable: DATABASE_URL",
    );
  });

  it("met en cache le pool PostgreSQL", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    const module = await import("@/lib/postgres");

    const firstPool = module.getPool();
    const secondPool = module.getPool();

    expect(firstPool).toBe(secondPool);
    expect(poolConstructorMock).toHaveBeenCalledTimes(1);
    expect(poolConstructorMock).toHaveBeenCalledWith({
      connectionString: "postgresql://localhost:5432/test",
    });
  });

  it("vérifie l'existence d'une relation via to_regclass", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock.mockResolvedValueOnce({
      rows: [{ exists: "public.users" }],
    });

    const module = await import("@/lib/postgres");

    await expect(module.hasRelation("public.users")).resolves.toBe(true);
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("to_regclass"),
      ["public.users"],
    );
  });

  it("retourne faux si la relation n'existe pas", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock.mockResolvedValueOnce({
      rows: [{ exists: null }],
    });

    const module = await import("@/lib/postgres");

    await expect(module.hasRelation("public.inconnue")).resolves.toBe(false);
  });

  it("charge les retours terrain avec fallback si certaines colonnes manquent", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "fr-1",
            citizenId: "cit-1",
            citizenName: "Claire Martin",
            neighborhood: "Centre",
            pollingStationCode: null,
            topic: "Stationnement",
            tags: null,
            summary: "Beaucoup de remarques sur la circulation.",
            source: "porte-a-porte",
            reportedAtLabel: "2026-03-25 10:30",
            authorName: "Superadmin",
            supportLevel: "unknown",
            priority: "medium",
            status: "new",
            sentiment: null,
            linkedTaskId: null,
            linkedTaskTitle: null,
          },
        ],
      });

    const module = await import("@/lib/postgres");
    const rows = await module.getFieldReportsData({
      q: " circulation ",
      supportLevel: "supporter",
      status: "open",
      pollingStationCode: "0003",
    });

    expect(rows).toEqual([
      expect.objectContaining({
        id: "fr-1",
        tags: [],
        supportLevel: "unknown",
        priority: "medium",
        status: "new",
        pollingStationCode: null,
      }),
    ]);
    expect(queryMock).toHaveBeenLastCalledWith(
      expect.stringContaining("'{}'::text[]"),
      ["circulation", "supporter", "open", "0003"],
    );
    expect(queryMock).toHaveBeenLastCalledWith(
      expect.not.stringContaining("fr.polling_station_code = $4"),
      ["circulation", "supporter", "open", "0003"],
    );
  });

  it("charge les options utilisateurs, bureaux et citoyens", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({
        rows: [{ id: "u1", fullName: "Jeanne Martin", email: "jeanne@example.com" }],
      })
      .mockResolvedValueOnce({
        rows: [{ code: "0003", label: "Bureau 0003 · Centre culturel" }],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "c1", label: "Claire Martin · Bureau 0003" }],
      });

    const module = await import("@/lib/postgres");

    await expect(module.getActiveUsers()).resolves.toEqual([
      { id: "u1", fullName: "Jeanne Martin", email: "jeanne@example.com" },
    ]);
    await expect(module.getPollingStationOptions()).resolves.toEqual([
      { code: "0003", label: "Bureau 0003 · Centre culturel" },
    ]);
    await expect(module.getCitizenOptions()).resolves.toEqual([
      { id: "c1", label: "Claire Martin · Bureau 0003" },
    ]);

    expect(queryMock).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("where is_active = true"),
    );
    expect(queryMock).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("from import_campaign.polling_stations_cabestany"),
    );
    expect(queryMock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining("from citizens"),
    );
  });

  it("retourne les contacts sous forme vide si la table n'existe pas", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock.mockResolvedValueOnce({
      rows: [{ exists: null }],
    });

    const module = await import("@/lib/postgres");

    await expect(module.getContactsData({ q: "presse" })).resolves.toEqual([]);
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("charge les contacts et normalise les tags absents", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({
        rows: [{ exists: "public.contacts" }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "contact-1",
            fullName: "Claire Martin",
            contactKind: "journalist",
            organization: "L'Indépendant",
            roleLabel: "Journaliste",
            email: "claire@example.com",
            phone: null,
            location: "Perpignan",
            tags: null,
            notes: "Suit les municipales",
            createdByName: "Superadmin",
            updatedAtLabel: "2026-03-25 11:00",
          },
        ],
      });

    const module = await import("@/lib/postgres");
    const contacts = await module.getContactsData({
      q: " Claire ",
      contactKind: "journalist",
    });

    expect(contacts).toEqual([
      expect.objectContaining({
        id: "contact-1",
        tags: [],
        contactKind: "journalist",
      }),
    ]);
    expect(queryMock).toHaveBeenLastCalledWith(
      expect.stringContaining("from contacts c"),
      [" Claire ", "journalist"],
    );
  });

  it("charge les citoyens et normalise historique et tâches liées", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "cit-1",
            fullName: "Claire Martin",
            phone: "0600000000",
            email: "claire@example.com",
            address: "1 rue de la mairie",
            neighborhood: "Centre",
            pollingStationCode: "0003",
            supportLevel: "supporter",
            tags: null,
            notes: "Présente au marché",
            createdByName: "Superadmin",
            updatedAtLabel: "2026-03-25 12:00",
            recentReports: null,
            relatedTasks: null,
          },
        ],
      });

    const module = await import("@/lib/postgres");
    const citizens = await module.getCitizensData({
      q: " Claire ",
      supportLevel: "supporter",
      pollingStationCode: "0003",
    });

    expect(citizens).toEqual([
      expect.objectContaining({
        id: "cit-1",
        tags: [],
        recentReports: [],
        relatedTasks: [],
      }),
    ]);
    expect(queryMock).toHaveBeenLastCalledWith(
      expect.stringContaining("'new'::text"),
      ["Claire", "supporter", "0003"],
    );
  });

  it("compose le dashboard avec fallbacks si les tables équipe manquent", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ count: "4" }] })
      .mockResolvedValueOnce({ rows: [{ count: "7" }] })
      .mockResolvedValueOnce({ rows: [{ count: "2" }] })
      .mockResolvedValueOnce({ rows: [{ count: "0" }] })
      .mockResolvedValueOnce({ rows: [{ count: "0" }] })
      .mockResolvedValueOnce({ rows: [{ count: "0" }] })
      .mockResolvedValueOnce({ rows: [{ count: "0" }] })
      .mockResolvedValueOnce({
        rows: [
          {
            label: "Retours ouverts",
            value: "4",
            summary: "Volume actuel",
            tone: "accent",
          },
          {
            label: "Urgences terrain",
            value: "0",
            summary: "Aucune urgence qualifiée",
            tone: "pine",
          },
          {
            label: "Tâches critiques",
            value: "1",
            summary: "Une tâche sensible",
            tone: "default",
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ title: "Réunion tractage", startsAtLabel: "28/03 18:30", location: "Local" }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            kind: "Retour terrain",
            title: "Stationnement",
            summary: "Sujet qui revient",
            happenedAtLabel: "25/03 10:00",
          },
        ],
      });

    const module = await import("@/lib/postgres");
    const dashboard = await module.getDashboardData();

    expect(dashboard.stats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Retours ouverts", value: "4" }),
        expect.objectContaining({ label: "Tâches ouvertes", value: "7" }),
        expect.objectContaining({ label: "Secteurs sans responsable", value: "0" }),
      ]),
    );
    expect(dashboard.sectorAlerts).toEqual([]);
    expect(dashboard.teamHighlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Comptes actifs", value: "0" }),
        expect.objectContaining({ label: "Fiches équipe", value: "0" }),
      ]),
    );
    expect(dashboard.actionItems[0]).toEqual(
      expect.objectContaining({
        label: "Traiter les retours urgents",
        href: "/field-reports",
      }),
    );
  });

  it("charge l'analyse terrain avec fallbacks de colonnes manquantes", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({
        rows: [
          {
            totalReports: "12",
            openReports: "12",
            urgentReports: "0",
            linkedCitizens: "5",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ topic: "Sans sujet", reportCount: "3" }],
      })
      .mockResolvedValueOnce({
        rows: [{ supportLevel: "unknown", reportCount: "12" }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            pollingStationCode: "Non rattaché",
            placeName: null,
            reportCount: "12",
            urgentCount: "0",
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const module = await import("@/lib/postgres");
    const analysis = await module.getFieldAnalysisData();

    expect(analysis.summary).toEqual({
      totalReports: 12,
      openReports: 12,
      urgentReports: 0,
      linkedCitizens: 5,
    });
    expect(analysis.supportBreakdown).toEqual([
      { supportLevel: "unknown", reportCount: 12 },
    ]);
    expect(analysis.stationBreakdown).toEqual([
      {
        pollingStationCode: "Non rattaché",
        placeName: null,
        reportCount: 12,
        urgentCount: 0,
      },
    ]);
    expect(analysis.urgentReports).toEqual([]);
  });

  it("retourne une couverture vide si les tables secteurs ne sont pas présentes", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ exists: null }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] });

    const module = await import("@/lib/postgres");
    const teamCoverage = await module.getTeamCoverageData();

    expect(teamCoverage).toEqual({
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
    });
  });

  it("charge les bureaux de vote enrichis", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          pollingStationCode: "0003",
          pollingStationNumber: 3,
          placeName: "Centre culturel",
          address: "Rue du centre",
          isCentralizer: true,
          geometryType: "Polygon",
          hasValidatedResults: true,
          inscrits2026: 700,
          votants2026: 540,
          exprimes2026: 513,
          topCandidateLabel: "Édith PUGNET",
          topCandidateGroup: "Cabestany Avant Tout",
          topCandidateVotes: 218,
        },
      ],
    });

    const module = await import("@/lib/postgres");
    const stations = await module.getPollingStations();

    expect(stations).toEqual([
      expect.objectContaining({
        pollingStationCode: "0003",
        placeName: "Centre culturel",
        topCandidateLabel: "Édith PUGNET",
      }),
    ]);
    expect(queryMock).toHaveBeenCalledWith(
      expect.stringContaining("from import_campaign.polling_stations_cabestany ps"),
    );
  });

  it("charge l'administration utilisateurs et normalise les permissions absentes", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({
        rows: [
          {
            id: "u1",
            email: "cabestanyavanttout@gmail.com",
            fullName: "Superadmin",
            role: "superadmin",
            isActive: true,
            orgFunctionId: null,
            orgFunctionLabel: null,
            passwordUpdatedAt: "2026-03-25 10:00",
            directPermissionIds: null,
            effectivePermissionCodes: null,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "f1", code: "campaign_director", label: "Directeur de campagne" }],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "p1", code: "users.read", label: "Lire les utilisateurs", module: "users" }],
      });

    const module = await import("@/lib/postgres");
    const adminData = await module.getUserAdminData();

    expect(adminData.users).toEqual([
      expect.objectContaining({
        email: "cabestanyavanttout@gmail.com",
        directPermissionIds: [],
        effectivePermissionCodes: [],
      }),
    ]);
    expect(adminData.orgFunctions).toHaveLength(1);
    expect(adminData.permissions).toHaveLength(1);
  });

  it("charge l'analyse électorale et convertit les valeurs numériques", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({ rows: [{ exists: true }] })
      .mockResolvedValueOnce({
        rows: [
          {
            validatedBureaus: "5",
            totalValidatedVotes: "2822",
            topCandidate: "Édith PUGNET",
            topCandidateVotes: "1210",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            candidateLabel: "Édith PUGNET",
            candidateGroup: "Cabestany Avant Tout",
            votes: 1210,
            share: "42.88",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            pollingStationCode: "0003",
            placeName: "Centre culturel",
            turnoutPct: "77.14",
            exprimes: 513,
            topCandidateLabel: "Édith PUGNET",
            topCandidateVotes: 218,
            topCandidateShare: "42.50",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            pollingStationCode: "0003",
            placeName: "Centre culturel",
            turnoutPct: "77.14",
            topCandidateLabel: "Édith PUGNET",
            topCandidateShare: "42.50",
            reportCount: "4",
            urgentCount: "1",
            opposedOrSkepticalCount: "2",
          },
        ],
      });

    const module = await import("@/lib/postgres");
    const electoral = await module.getElectoralAnalysisData();

    expect(electoral.communeSummary).toEqual({
      validatedBureaus: 5,
      totalValidatedVotes: 2822,
      topCandidate: "Édith PUGNET",
      topCandidateVotes: 1210,
    });
    expect(electoral.candidateScores[0]).toEqual(
      expect.objectContaining({ share: 42.88, votes: 1210 }),
    );
    expect(electoral.fieldOverlay[0]).toEqual(
      expect.objectContaining({
        reportCount: 4,
        urgentCount: 1,
        opposedOrSkepticalCount: 2,
      }),
    );
  });

  it("retourne une recherche vide si la requête est vide", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    const module = await import("@/lib/postgres");

    await expect(
      module.getSearchResults("   ", {
        canReadCitizens: true,
        canReadFieldReports: true,
        canReadTasks: true,
      }),
    ).resolves.toEqual({
      query: "",
      citizens: [],
      fieldReports: [],
      tasks: [],
    });

    expect(queryMock).not.toHaveBeenCalled();
  });

  it("charge les résultats de recherche avec fallbacks si certaines colonnes manquent", async () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    queryMock
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({ rows: [{ exists: false }] })
      .mockResolvedValueOnce({
        rows: [{ id: "c1", fullName: "Claire Martin", supportLevel: "unknown", pollingStationCode: null }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "fr1",
            topic: "Stationnement",
            summary: "Sujet qui remonte",
            status: "new",
            citizenName: "Claire Martin",
            pollingStationCode: null,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "t1", title: "Relancer Claire", status: "todo", priority: "high", ownerName: "Jeanne" }],
      });

    const module = await import("@/lib/postgres");
    const results = await module.getSearchResults(" Claire ", {
      canReadCitizens: true,
      canReadFieldReports: true,
      canReadTasks: true,
    });

    expect(results.query).toBe("Claire");
    expect(results.citizens[0]).toEqual(
      expect.objectContaining({ supportLevel: "unknown", pollingStationCode: null }),
    );
    expect(results.fieldReports[0]).toEqual(
      expect.objectContaining({ status: "new", pollingStationCode: null }),
    );
    expect(results.tasks[0]).toEqual(
      expect.objectContaining({ title: "Relancer Claire", priority: "high" }),
    );
  });
});
