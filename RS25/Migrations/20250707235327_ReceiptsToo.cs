using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS25.Migrations
{
    /// <inheritdoc />
    public partial class ReceiptsToo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ReimId",
                table: "Receipt",
                newName: "PurId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PurId",
                table: "Receipt",
                newName: "ReimId");
        }
    }
}
