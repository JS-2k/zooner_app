using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zooner.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryHoldsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InventoryHolds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StoreInventoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    StoreId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    HoldCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    QrToken = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ExpiresAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReleasedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryHolds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryHolds_Shops_StoreId",
                        column: x => x.StoreId,
                        principalTable: "Shops",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryHolds_StoreInventories_StoreInventoryId",
                        column: x => x.StoreInventoryId,
                        principalTable: "StoreInventories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryHolds_Users_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InventoryHolds_CustomerId_Status",
                table: "InventoryHolds",
                columns: new[] { "CustomerId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_InventoryHolds_ExpiresAtUtc",
                table: "InventoryHolds",
                column: "ExpiresAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryHolds_StoreId",
                table: "InventoryHolds",
                column: "StoreId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryHolds_StoreInventoryId_Status",
                table: "InventoryHolds",
                columns: new[] { "StoreInventoryId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InventoryHolds");
        }
    }
}
