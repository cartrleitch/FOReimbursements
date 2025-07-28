using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RS25.Migrations
{
    /// <inheritdoc />
    public partial class VendorChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "VendorWebsite",
                table: "Reimbursement",
                newName: "VendorId");

            migrationBuilder.RenameColumn(
                name: "VendorAddress",
                table: "Reimbursement",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "Vendor",
                table: "Reimbursement",
                newName: "ActionRequested");

            migrationBuilder.CreateTable(
                name: "Vendor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Website = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    State = table.Column<string>(type: "text", nullable: true),
                    ZipCode = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vendor");

            migrationBuilder.RenameColumn(
                name: "VendorId",
                table: "Reimbursement",
                newName: "VendorWebsite");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Reimbursement",
                newName: "VendorAddress");

            migrationBuilder.RenameColumn(
                name: "ActionRequested",
                table: "Reimbursement",
                newName: "Vendor");
        }
    }
}
